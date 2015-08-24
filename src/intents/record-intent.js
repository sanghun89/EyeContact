import Rx from 'rx';
import Keys from '../keys/record-key';

let subject = new Rx.ReplaySubject(1);

export default {
    subject,
    initRecord(events) {
        subject.onNext({
            key : Keys.RECORD_TRIGGER,
            events
        });
    }
};
