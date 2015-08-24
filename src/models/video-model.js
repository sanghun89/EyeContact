import Rx from 'rx';
import update from 'react/lib/update';
import VideoKey from '../keys/video-key';
import VideoIntent from '../intents/video-intent';
import config from '../config/video.config';

let subject = new Rx.ReplaySubject(1),
    video = document.createElement('video'),
    vendorUrl = window.URL || window.webkitURL,
    state = {
        observable : null
    };

navigator.getMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

VideoIntent.subject.subscribe((payload) => {
   switch (payload.key) {
       case VideoKey.VIDEO_CONSUME:
           videoToCanvas(payload.context);
           break;
       default:
           console.warn(`${payload.key} not recognized in model.`);
   }
});

subject.onNext(state);

function videoHandler(stream, observer) {
    video.src = vendorUrl.createObjectURL(stream);
    video.addEventListener('play', () => {
        observer.onNext(video);
    }, observer.onError.bind(observer));
    video.play();
}

function createObservableFromContext(context) {
    let source = Rx.Observable.create((observer) => {
        navigator.getMedia({
            video : true,
            audio: false
        }, (stream) => {
            videoHandler(stream, observer);
        }, observer.onError.bind(observer));

        return () => { console.log('video disposed'); };
    }).concatMap((videoElem) => {
        subject.onNext(state);
        return Rx.Observable.create((observer) => {
            function draw() {
                context.drawImage(videoElem, 0, 0, config.width, config.height);
                observer.onNext(context);
                window.requestAnimationFrame(draw);
            }
            draw();
            return () => { console.log('canvas disposed'); };
        });
    }).publish().refCount();

    source.subscribe();

    return source;
}

function videoToCanvas(context) {
    state = update(state, {
        $merge : {
            observable : createObservableFromContext(context)
        }
    });

    subject.onNext(state);
}

export default {
    subject
};
