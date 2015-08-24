import Rx from 'rx';
import Keys from '../keys/sampler-key';

let subject = new Rx.ReplaySubject(1);

export default {
    subject,
    resizeSample(context) {
        subject.onNext({
            key : Keys.SAMPLE_RESIZE,
            context
        });
    }
};
