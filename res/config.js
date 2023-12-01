/**
 * setter
 */

// 初始化配置
layui.define(['all'], function(exports){
  exports('setter', {
    paths: { // v1.9.0 及以上版本的写法
      core: layui.cache.base + 'adminui/dist/', // 核心库所在目录
      views: layui.cache.base + 'views/', // 业务视图所在目录
      modules: layui.cache.base + 'modules/', // 业务模块所在目录
      base: layui.cache.base // 记录静态资源所在基础目录
    },

    container: 'LAY_app', // 容器ID
    entry: 'setting', // 默认视图文件名
    engine: '.html', // 视图文件后缀名
    pageTabs: false, // 是否开启页面选项卡功能。单页版不推荐开启
    
    name: 'cgBinTool', // 项目名字
    tableName: 'cgBinTool', // 本地存储表名
    MOD_NAME: 'admin', // 模块事件名
    
    debug: true, // 是否开启调试模式。如开启，接口异常时会抛出异常 URL 等信息
    interceptor: false, // 是否开启未登入拦截
    
    // 自定义请求字段
    request: {
      tokenName: 'access_token' // 自动携带 token 的字段名。可设置 false 不携带。
    },
    
    // 自定义响应字段
    response: {
      statusName: 'code', // 数据状态的字段名称
      statusCode: {
        ok: 0, // 数据状态一切正常的状态码
        logout: 1001 // 登录状态失效的状态码
      },
      msgName: 'msg', // 状态信息的字段名称
      dataName: 'data' // 数据详情的字段名称
    },
    
    // 独立页面路由，可随意添加（无需写参数）
    indPage: [
      '/user/login', // 登入页
      '/user/reg', // 注册页
      '/user/forget', // 找回密码
      '/template/tips/test' // 独立页的一个测试 demo
    ],
        
    // 主题配置
    theme: {
      // 内置主题配色方案
      color: [{
        main: '#393D49',
        logo: '#393D49',
        selected: '#009688',
        header: '#23262E',
        alias: 'default' // 经典风格1
      }],
      
      // 初始的颜色索引，对应上面的配色方案数组索引
      // 如果本地已经有主题色记录，则以本地记录为优先，除非请求本地数据（localStorage）
      initColorIndex: 0
    }
  });
});
