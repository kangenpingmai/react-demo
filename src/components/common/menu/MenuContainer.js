import React, { Component } from 'react'
import { connect } from 'react-redux'
import randomString from 'random-string'
import { Map } from 'immutable'

import { 
  MenuList,
  MenuListNav,
  MenuListNavItem,
  MenuListContent
} from './styledComponent.js'

import wrapperAnimate from 'components/highorder/wrapperAnimate'

import BScroll from 'better-scroll'

import { withRouter } from 'react-router-dom'

// import { fromJS } from 'immutable'

const getNavList = (state) => {
  if (state.getIn(['menu', 'from']) === 'category') {
    return state.getIn(['cookbook', 'categories']) || Map({})
  } else {
    return state.getIn(['cookbook', 'material']) || Map({})
  }
}

const mapState = (state) => {
  return {
    // 拿到的数据是immutable格式
    navList: getNavList(state)
  }
}

class MenuCategory extends Component {
  constructor () {
    super()
    this.state = {
      currentIndex: 0,
      navContent: []
    }
  }
  render () {
    return (
      <MenuList>
        <div ref={el => this.navListScroll = el}>
          <MenuListNav>
            {
              // 循环immutable的方法
              // 吧key值放到一个集合 然后再流的操作
              this.props.navList.keySeq().map((v, i) => {
                // console.log(v,i)
                return (
                  <MenuListNavItem 
                    key={v} 
                    active={this.state.currentIndex === i}
                    onTouchStart={(e) => this.handleNavClick(v, i, e)}
                  >
                    <span>
                      { v }
                    </span>
                  </MenuListNavItem>
                )
              })
            }
          </MenuListNav>
        </div>
        <MenuListContent ref={el => this.navContentScroll = el}>
          <div>
          {/* navContent是List数据结构，有map方法 */}
            {
              this.state.navContent && this.state.navContent.map((v, i) => {
                // 热门分类前几条数据是map格式，需要设置两种情况
                return <div key={randomString()} onClick={() => this.props.history.push('/list')}>{typeof(v) !== 'string' ? v.get('title') : v}</div>
              })
            }
          </div>
        </MenuListContent>
      </MenuList>
    )
  }

  componentDidMount () {
    this.navlistscroll = new BScroll(this.navListScroll, {click: true})
    this.navcontentscroll = new BScroll(this.navContentScroll, {click: true})
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      // first()找出map数据第一个
      navContent: nextProps.navList && nextProps.navList.first()
    }, () => {
      this.navcontentscroll.refresh()
    })
  }

  handleNavClick (v, i, e) {
    // 当前高亮
    this.setState({
      currentIndex: i
    })

    // 边界滑动
    this.getCriticalPoint(e)

    // 显示菜单内容
    this.setState({
      navContent: this.filterNavList(v)
    }, () => {
      this.navcontentscroll.refresh()
    })
  }

  getCriticalPoint (e) {
    let clientY = e.touches[0].clientY
    let isReachTopPoint = clientY - 108 < 90
    // window.innerHeighgt - 44 - 64 - 50 : flex视口高度
    // clientY - (44 + 64) - flex视口高度 : 边界值
    let isReachBottomPoint = clientY - 108 - (window.innerHeight - 158) > -90
    if (isReachTopPoint) {
      this.navlistscroll.scrollBy(0, window.innerHeight/2, 100)
      this.navlistscroll.refresh()
    }
    if (isReachBottomPoint) {
      this.navlistscroll.scrollBy(0, -window.innerHeight/2, 100)
      this.navlistscroll.refresh()
    }
  }

  filterNavList(key) {
    // immutable中find方法过滤
    return this.props.navList.find((v, k) => {
      return k === key
    })
  }
}

export default withRouter(connect(mapState)(wrapperAnimate(MenuCategory)))