import Rx from 'rx';
import update from 'react/lib/update';
import RecordKey from '../keys/record-key';
import RecordIntent from '../intents/record-intent';
import VideoModel from '../models/video-model';
import SampleModel from '../models/sampler-model';
import _ from 'lodash';

let subject = new Rx.ReplaySubject(1),
    state = {
        name: '',
        recordStatus : 'stopped',
        data :{
            img :[],
            classification : []
        }
    };

subject.onNext(state);

function saveRecord() {
    return Rx.Observable.create((observer) => {

    });
}

function startAndStopRecord(events) {
    let starts = Rx.Observable.fromEvent(events.startRecord, 'click');
    let stops = Rx.Observable.fromEvent(events.stopRecord, 'click');
    let SampleState;

    let source = starts.concatMap(() => {
        state = update(state, {
            $merge : {
                recordStatus : 'started'
            }
        });
        subject.onNext(state);

        SampleState = _.clone(SampleModel.getState());
        return Rx.Observable.create((observer) => {
            VideoModel.subject.subscribe((VideoState) => {
                if (VideoState.observable) {
                    observer.onNext(VideoState.observable);
                }
            });
        }).concatAll().takeUntil(stops).doOnCompleted(() => {
            state = update(state, {
                $merge : {
                    recordStatus : 'stopped'
                }
            });
            subject.onNext(state);
        });
    });

    source.subscribe((context) => {
        let {left, top, width, height} = SampleState;
        let imgData = context.getImageData(left, top, width, height);
        console.log(imgData);
    });
}

function initRecord({events}) {
    startAndStopRecord(events);
}

RecordIntent.subject.subscribe((payload) => {
    switch (payload.key) {
        case RecordKey.RECORD_TRIGGER:
            initRecord(payload);
            break;
        default:
            console.warn(`${payload.key} not recognized in model.`);
    }
});

export default {
    subject
};

