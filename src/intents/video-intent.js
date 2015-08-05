import Rx from 'rx';
import Keys from '../keys/video-key';

let subject = new Rx.ReplaySubject(1);

export default {
    subject,
    moveVideoToCanvas(context) {
        subject.onNext({
            key : Keys.VIDEO_CONSUME,
            context
        });
    }
};
