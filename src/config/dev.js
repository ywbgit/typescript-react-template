window.Config = {};
/**
 * 配置文件
 *
 * baseUrl: api地址
 * host: 开发服务host
 * port: 开发服务port
 * limitWidthCenterUseHightbit: 当窗宽或窗位的值大于该设定时，启用Hightbit的调窗模式
 */
// config.baseUrl = 'http://192.168.2.246/api/', // 起哥
// config.baseUrl = 'http://localhost:3410/api/'; // 调试
// config.baseUrl = 'http://192.168.1.150:1717/api/'; // iis
window.Config.baseUrl = 'http://192.168.1.150:1717/api/'; // iis
window.Config.limitWidthCenterUseHightbit = 10000;
