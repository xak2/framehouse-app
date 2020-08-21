import { SET_NAVIGATION } from '../actions/projectActions';

const projectReducer = (state = { value: 0 }, action) => {
    switch (action.type) {
        case SET_NAVIGATION:
            return { ...state, value: state.value + 1 };
        default:
            return { ...state };
    }
};

export default projectReducer;