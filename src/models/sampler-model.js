import Rx from 'rx';
import _ from 'lodash';
import update from 'react/lib/update';
import SamplerKey from '../keys/sampler-key';
import SamplerIntent from '../intents/sampler-intent';
import config from '../config/video.config';

let subject = new Rx.ReplaySubject(1),
    state = {
        width : config.width,
        height : config.height,
        left : 0,
        top : 0
    };

/*
 Creating Observable on document click, drag event to determine the target DOM and move/resize the Sampler
 */

function resizeObservable(ctx, cb) {
    let mouseDowns = Rx.Observable.fromEvent(document, 'mousedown');
    let mouseMoves = Rx.Observable.fromEvent(document, 'mousemove');
    let mouseUps = Rx.Observable.fromEvent(document, 'click');

    mouseDowns
        .concatMap((contactPoint) => {
            let direction = false;
            let originState = _.clone(state);

            if (contactPoint.target && contactPoint.target.dataset.direction) {
                direction = contactPoint.target.dataset.direction;
            } else {
                if (contactPoint.target.className === 'sampler-container') {
                    direction = 'omni';
                }
            }

            return mouseMoves
                .takeUntil(mouseUps)
                .map((movePoint) => ({
                    pageX: movePoint.pageX - contactPoint.pageX,
                    pageY: movePoint.pageY - contactPoint.pageY,
                    direction,
                    originState
                }));

        }).subscribe(cb);
}

/*
 Calculating dimensions
 */
function determineDimensions(data) {
    let dimensions = {};
    switch (data.direction) {
        case 'nw':
            dimensions.width = data.originState.width - data.pageX;
            dimensions.height = data.originState.height - data.pageY;
            dimensions.left = data.originState.left + data.pageX;
            dimensions.top = data.originState.top + data.pageY;
            break;
        case 'n':
            dimensions.height = data.originState.height - data.pageY;
            dimensions.top = data.originState.top + data.pageY;
            break;
        case 'ne':
            dimensions.width = data.originState.width + data.pageX;
            dimensions.height = data.originState.height - data.pageY;
            dimensions.top = data.originState.top + data.pageY;
            break;
        case 'e':
            dimensions.width = data.originState.width - data.pageX;
            dimensions.left = data.originState.left + data.pageX;
            break;
        case 'w':
            dimensions.width = data.originState.width + data.pageX;
            break;
        case 'se':
            dimensions.width = data.originState.width - data.pageX;
            dimensions.height = data.originState.height + data.pageY;
            dimensions.left = data.originState.left + data.pageX;
            break;
        case 's':
            dimensions.height = data.originState.height + data.pageY;
            break;
        case 'sw':
            dimensions.width = data.originState.width + data.pageX;
            dimensions.height = data.originState.height + data.pageY;
            break;
        case 'omni':
            dimensions.left = data.originState.left + data.pageX;
            dimensions.top = data.originState.top + data.pageY;
            break;
        case 'change':
            dimensions.width = data.width;
            dimensions.height = data.height;
            break;
    }

    return dimensions;
}

/*
 Set bounds
 */
function applyBounds(dimensions, data) {
    if (typeof dimensions.width !== 'undefined') {
        dimensions.width = dimensions.width > config.width ? config.width : dimensions.width;
        dimensions.width = dimensions.width < 0 ? 0 : dimensions.width;
    }


    if (typeof dimensions.height !== 'undefined') {
        dimensions.height = dimensions.height > config.height ? config.height : dimensions.height;
        dimensions.height = dimensions.height < 0 ? 0 : dimensions.height;
    }

    if (data && data.direction === 'omni') {
        if (typeof dimensions.left !== 'undefined') {
            dimensions.left = dimensions.left > config.width - data.originState.width ? config.width - data.originState.width : dimensions.left;
            dimensions.left = dimensions.left < 0 ? 0 : dimensions.left;
        }


        if (typeof dimensions.top !== 'undefined') {
            dimensions.top = dimensions.top > config.height - data.originState.height ? config.height - data.originState.height : dimensions.top;
            dimensions.top = dimensions.top < 0 ? 0 : dimensions.top;
        }
    }

    return dimensions;
}

function calculateResize(data) {
    let dimensions = determineDimensions(data);
    return applyBounds(dimensions, data);
}

function resizeSample(context) {
    resizeObservable(context, (data) => {
        if (data && data.direction) {
            state = update(state, {
                $merge : calculateResize(data)
            });
            subject.onNext(state);
        }
    });
}

function changeSize(dimensions) {
    dimensions = applyBounds(dimensions);
    state = update(state, {
        $merge : dimensions
    });

    subject.onNext(state);
}

SamplerIntent.subject.subscribe((payload) => {
    switch (payload.key) {
        case SamplerKey.SAMPLE_RESIZE:
            resizeSample(payload.context);
            break;
        case SamplerKey.SAMPLE_SET_DIM:
            changeSize(payload.dimensions);
            break;
        default:
            console.warn(`${payload.key} not recognized in model.`);
    }
});

subject.onNext(state);

export default {
    subject,
    getState() {
        return state;
    }
};
