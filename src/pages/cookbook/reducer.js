import { GET_CATEGORY_DATA, GET_LIST_DATA} from './actionTypes'
import { fromJS } from 'immutable'

const defaultState = fromJS({
  categories: null,
  material: null,
  list: []
})

export default (state=defaultState, action) => {
  if (action.type === GET_CATEGORY_DATA) {
    // return {
    //   ...state,
    //   categories: {...state.categories, ...action.categories.category},
    //   material: {...state.material, ...action.categories.material}
    // }
    // 1、immutable数据结构复用，提高性能、2写法简单，只修改树，返回的新的数据，不该变原来的
    let newCate = state.setIn(['categories'], fromJS(action.categories.category))
    let newMat = newCate.setIn(['material'], fromJS(action.categories.material))
    return newMat
  }

  if (action.type === GET_LIST_DATA) {
    return state.setIn(['list'], fromJS(action.list))
  }

  return state
}