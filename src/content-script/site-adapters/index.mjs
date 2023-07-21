import baidu from './baidu'
import bilibili from './bilibili'
import youtube from './youtube'
import github from './github'
import gitlab from './gitlab'
import zhihu from './zhihu'
import reddit from './reddit'
import quora from './quora'
import stackoverflow from './stackoverflow'
import juejin from './juejin'
import weixin from './weixin'
import followin from './followin'

/**
 * @typedef {object} SiteConfigAction
 * @property {function} init
 */
/**
 * @typedef {object} SiteConfig
 * @property {string[]|function} inputQuery - for search box
 * @property {string[]} sidebarContainerQuery - prepend child to
 * @property {string[]} appendContainerQuery - if sidebarContainer not exists, append child to
 * @property {string[]} resultsContainerQuery - prepend child to if insertAtTop is true
 * @property {SiteConfigAction} action
 */
/**
 * @type {Object.<string,SiteConfig>}
 */
export const config = {
  google: {
    inputQuery: ["input[name='q']", "textarea[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
    resultsContainerQuery: ['#rso'],
  },
  bing: {
    inputQuery: ["[name='q']"],
    sidebarContainerQuery: ['#b_context'],
    appendContainerQuery: [],
    resultsContainerQuery: ['#b_results'],
  },
  yahoo: {
    inputQuery: ["input[name='p']"],
    sidebarContainerQuery: ['#right', '.Contents__inner.Contents__inner--sub'],
    appendContainerQuery: ['#cols', '#contents__wrap'],
    resultsContainerQuery: [
      '#main-algo',
      '.searchCenterMiddle',
      '.Contents__inner.Contents__inner--main',
      '#contents',
    ],
  },
  duckduckgo: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.js-react-sidebar', '.react-results--sidebar'],
    appendContainerQuery: ['#links_wrapper'],
    resultsContainerQuery: ['.react-results--main'],
  },
  startpage: {
    inputQuery: ["input[name='query']"],
    sidebarContainerQuery: ['.layout-web__sidebar.layout-web__sidebar--web'],
    appendContainerQuery: ['.layout-web__body.layout-web__body--desktop'],
    resultsContainerQuery: ['.mainline-results'],
  },
  baidu: {
    inputQuery: ["input[id='kw']"],
    sidebarContainerQuery: ['#content_right'],
    appendContainerQuery: ['#container'],
    resultsContainerQuery: ['#content_left', '#results'],
    action: {
      init: baidu.init,
    },
  },
  kagi: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.right-content-box._0_right_sidebar'],
    appendContainerQuery: ['#_0_app_content'],
    resultsContainerQuery: ['#main', '#app'],
  },
  yandex: {
    inputQuery: ["input[name='text']"],
    sidebarContainerQuery: ['#search-result-aside'],
    appendContainerQuery: [],
    resultsContainerQuery: ['#search-result'],
  },
  naver: {
    inputQuery: ["input[name='query']"],
    sidebarContainerQuery: ['#sub_pack'],
    appendContainerQuery: ['#content'],
    resultsContainerQuery: ['#main_pack', '#ct'],
  },
  brave: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#side-right'],
    appendContainerQuery: [],
    resultsContainerQuery: ['#results'],
  },
  searx: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#sidebar_results', '#sidebar'],
    appendContainerQuery: [],
    resultsContainerQuery: ['#urls', '#main_results', '#results'],
  },
  ecosia: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.sidebar.web__sidebar'],
    appendContainerQuery: ['#main'],
    resultsContainerQuery: ['.mainline'],
  },
  neeva: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.result-group-layout__stickyContainer-iDIO8'],
    appendContainerQuery: ['.search-index__searchHeaderContainer-2JD6q'],
    resultsContainerQuery: ['.result-group-layout__component-1jzTe', '#search'],
  },
  bilibili: {
    inputQuery: bilibili.inputQuery,
    sidebarContainerQuery: ['#danmukuBox'],
    appendContainerQuery: [],
    resultsContainerQuery: ['#danmukuBox'],
    action: {
      init: bilibili.init,
    },
  },
  youtube: {
    inputQuery: youtube.inputQuery,
    sidebarContainerQuery: [
      '#secondary:not([style*="display: none"]):not(.ytd-two-column-browse-results-renderer)',
    ],
    appendContainerQuery: [],
    resultsContainerQuery: [
      '#secondary:not([style*="display: none"]):not(.ytd-two-column-browse-results-renderer)',
    ],
    action: {
      init: youtube.init,
    },
  },
  github: {
    inputQuery: github.inputQuery,
    sidebarContainerQuery: ['#diff', '.commit'],
    appendContainerQuery: [],
    resultsContainerQuery: ['#diff', '.commit'],
    action: {
      init: github.init,
    },
  },
  gitlab: {
    inputQuery: gitlab.inputQuery,
    sidebarContainerQuery: ['.info-well', '.js-commit-box-info'],
    appendContainerQuery: [],
    resultsContainerQuery: ['.info-well', '.js-commit-box-info'],
  },
  zhihu: {
    inputQuery: zhihu.inputQuery,
    sidebarContainerQuery: ['.Question-sideColumn', '.Post-Header', '.Question-main'],
    appendContainerQuery: [],
    resultsContainerQuery: ['.Question-sideColumn', '.Post-Header', '.Question-main'],
  },
  reddit: {
    inputQuery: reddit.inputQuery,
    sidebarContainerQuery: ['#pdp-right-rail-topics div'],
    appendContainerQuery: [],
    resultsContainerQuery: ['#pdp-right-rail-topics div'],
  },
  quora: {
    inputQuery: quora.inputQuery,
    sidebarContainerQuery: ['.q-box.PageContentsLayout___StyledBox-d2uxks-0'],
    appendContainerQuery: [],
    resultsContainerQuery: ['.q-box.PageContentsLayout___StyledBox-d2uxks-0'],
  },
  stackoverflow: {
    inputQuery: stackoverflow.inputQuery,
    sidebarContainerQuery: ['#sidebar'],
    appendContainerQuery: [],
    resultsContainerQuery: ['#sidebar'],
  },
  juejin: {
    inputQuery: juejin.inputQuery,
    sidebarContainerQuery: ['div.sidebar'],
    appendContainerQuery: [],
    resultsContainerQuery: ['div.main-area.article-area > article > div.article-content'],
  },
  'mp.weixin.qq': {
    inputQuery: weixin.inputQuery,
    sidebarContainerQuery: ['.qr_code_pc', '#js_content'],
    appendContainerQuery: [],
    resultsContainerQuery: ['#js_content'],
  },
  followin: {
    inputQuery: followin.inputQuery,
    sidebarContainerQuery: [],
    appendContainerQuery: [],
    resultsContainerQuery: ['#article-content', '#thead-gallery'],
  },
}
