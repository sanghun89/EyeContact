import Rx from 'rx';
import update from 'react/lib/update';
import VideoKey from '../keys/video-key';
import VideoIntent from '../intents/video-intent';
import config from '../components/video.config';

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

function videoHandler(stream, observer) {
    video.src = vendorUrl.createObjectURL(stream);
    video.addEventListener('play', () => {
        observer.onNext(video);
    });
    video.play();
}

function createObservableFromContext(context) {
    return Rx.Observable.create((observer) => {
        navigator.getMedia({
            video : true,
            audio: false
        }, (stream) => {
            videoHandler(stream, observer);
        }, observer.onError);

        return () => { console.log('video disposed'); };
    }).concatMap((videoElem) => {
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
}

function videoToCanvas(context) {
    state = update(state, {
        $merge : {
            observable : createObservableFromContext(context)
        }
    });

    subject.onNext(state);
}

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

export default {
    subject
};
