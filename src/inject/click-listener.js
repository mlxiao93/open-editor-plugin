document.addEventListener(
  'click',
  function (e) {
    if (!e.altKey) return;
    const target = e.target;
    const path = target.dataset.oepPath;
    if (!path) return;
    const [pathname, line] = path.split(':');
    // 发送打开编辑器请求
    fetch(`/oep-open-editor?pathname=${pathname}&line=${line}`);
  },
  true
);
