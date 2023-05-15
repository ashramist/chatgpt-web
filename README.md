 本工程后端服务基于Laf 开发 
 前端工程基于 大佬 ChenZhaoYu 的 chatgpt-web工程 二次开发
 # 在线体验
   [H5在线体验](https://github.com/dengweijing/chatgpt-web/blob/master/src/assets/logo.svg)(https://uuuwmz-chatgpt.site.laf.run/)
#  为何需要增加注册功能 
   由于资源有限，所以这是为了避免一部分的用户滥用，所以保持不完全开放的方式提供给大家使用

# 访问流程说明
 建站说明，鉴于laf 分为海外版和国内版本，我们的chatgpt 是必须要走海外版服务器的。
 如果直接使用laf.dev 进行后端服务构建，如果是部署到微信公众号或者微信小程序，那么laf.dev 域名是没有进行备案的。所以我们采用代理的方式，在laf.dev上构建我们的后端服务，通过laf.run 国内站转发我们的接口服务，这样就避免了我们的域名备案问题，同时，我们的服务直接走laf.run 也可以避免直接访问laf.dev 带来的请求损耗。


 通过这种方式，我们可以减少一半的请求时间。
 

 也就是说明我们的服务访问链路是如此 

 
 1. 请求：客户端  -> laf.run -> laf.dev 
 2. 返回：laf.dev -> laf.run -> 客户端 

# 配置说明 
  1. 如果需要在此工程中进行二次开发，并且是基于laf ，可以配置文件中的.env.example 文件替换为.env 文件，配置自己的laf.run 构建的服务名称。
  2. 至于chatgpt 相关的laf 工程，后续如果有需求，可以提issue ，我会同步更新到此工程 
# 未来 （后期我将构建）
  1. 微信公众号h5网页版本
  2. 微信小程序版本 
敬请期待