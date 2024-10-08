* cm6 自带一个插件库， 可以用来快速更新到最新的插件版本
* `ctrl+s` 自动保存你的tiddler, 不再需要先退出编辑保存了
* 当wiki 含有异常保存的draft tiddler, 会引起一些小的问题.
* displaylabel 如果含有emoji 会出现乱码问题
* `ctrl+space` can trigger completion, but if you use chinese ime, this shortcut maybe conflict with chinese ime

* 友情提示： obsidian 的编辑器库用的也是codemirror6, 但是我们(tiddlywiki)可以在最大程度上发挥cm6的扩展能力，从而进一步优化编辑写作体验.

* Emoji complete need install [[$:/plugins/oeyoews/tiddlywiki-cmp-emoji]] plugin
* If you hope add your custom snippets, your can write a simple plugin module(module-type: snippets).
* Presss tab to accept current completion
* Prese `ctrl + /` to comment line(non vimmode)
* vimmode: `"+y`(copy to system clipboard)
* vimmode: `"+p`(paste system clipboard to editor)
* trigger 的触发时根据正则表达式来检测的， 所以触发器的前面不能紧挨着其他字符， 比如 `xxx/`这种是不行的， 需要是`xxx /` 这种.
* (vim) :c(opy) to copy current tiddler text comtent
* vim 也支持直接 ctrl + c 复制了