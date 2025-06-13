export default defineNitroPlugin(() => {
  // nitroApp.hooks.hook('content:file:beforeParse', (file: { body: string }) => {
  //   // 匹配markdown文件内的元信息
  //   const match = file.body.match(/---\n([\s\S]+?)\n---\n([\s\S]*)/);
  //   if (match) {
  //     let frontMatter = match[1];
  //     const mainContent = match[2];
  //     // 如果不包含_path字段, 则使用title字段和一个前缀来生成_path
  //     if (!frontMatter.includes('_path:')) {
  //       // 提取 title 字段的值
  //       const titleMatch = frontMatter.match(/title:\s*(.+)/);
  //       if (titleMatch && titleMatch.length > 1) {
  //           const titleValue = titleMatch[1].trim();
  //           const pathValue = `/post/${titleValue}`;
  //           // 将 _path 插入到 front-matter 中
  //           frontMatter = `_path: ${pathValue}\n` + frontMatter;
  //       } else {
  //         return;
  //       }
  //   }
  //   // 重新组合文件内容
  //   const newContent = `---\n${frontMatter}\n---\n${mainContent}`;
  //   file.body = newContent;
  //   }
  //   // 如果页面内没有 _path 属性, 则自动添加为 /blog/ + 文件名

  // });
})
