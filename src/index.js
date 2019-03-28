import React from 'react';
import dva from 'dva';
import dynamic from 'dva/dynamic';
import createLoading from 'dva-loading';
import { Router } from 'dva/router';
import createHistory from 'history/createHashHistory';
import request from 'cmn-utils/lib/request';
import createRoutes from '@/routes';
import 'assets/styles/index.less';
import config from './config';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { homepage } from '../package.json';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import Client from 'shopify-buy';
const httpLink = createHttpLink({ uri: 'https://mishuo-test.myshopify.com/api/graphql' })

const middlewareLink = setContext(() => ({
  headers: {
    'X-Shopify-Storefront-Access-Token': '8f99ada3501dbc632df511e72e7220c1'
  }
}))

const client = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache(),
})

const clients = Client.buildClient({
  storefrontAccessToken: '8f99ada3501dbc632df511e72e7220c1',
  domain: 'mishuo-test.myshopify.com'
});
// -> 初始化
const app = dva({
  history: createHistory({
    basename: homepage
  })
});

// -> 插件
app.use(createLoading());
app.use({ onError: config.exception.global });

// -> 请求
request.config(config.request);

// 使用mock数据
require('./__mocks__');
// -> Developer mock data
// if (process.env.NODE_ENV === 'development') {
//   require('./__mocks__');
// }

// -> loading
dynamic.setDefaultLoadingComponent(() => config.router.loading);

// -> 注册全局模型
app.model(require('./models/global').default);

// -> 初始化路由
app.router(({ history, app }) => (
  <LocaleProvider locale={zh_CN}>
    <Router history={history}>{createRoutes(app)}</Router>
  </LocaleProvider>
));

// -> Start
app.start('#root');

// export global
export default {
  app,client,clients,
  store: app._store,
  dispatch: app._store.dispatch
};
