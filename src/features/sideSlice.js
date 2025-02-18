

const initialState = {
  sidebarUnfoldable: false, // initial state
  sidebarShow: true,
};

const sidebarReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        sidebarUnfoldable: action.sidebarUnfoldable !== undefined ? action.sidebarUnfoldable : state.sidebarUnfoldable,
        sidebarShow: action.sidebarShow !== undefined ? action.sidebarShow : state.sidebarShow,
      };
    default:
      return state;
  }
};

export default sidebarReducer;
