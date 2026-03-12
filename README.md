# 掘金文章 Action (JueJin-Post)

在 GitHub Actions 中获取指定掘金用户的最近文章，输出为 Markdown 格式，可用于 README、博客侧栏等展示「最近更新」列表。

## 使用方式

### 1. 在 workflow 中引用

```yaml
name: Update README

on:
  schedule:
    - cron: '0 8 * * *'  # 每天 8 点
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: 获取掘金最近文章
        id: juejin
        uses: SuperHuangXu/juejin-post-action@v1
        with:
          user_id: '你的掘金用户ID'
          # limit: '10'   # 可选，1-20，默认 10

      - name: 使用输出
        run: |
          # 方式一：使用步骤输出
          echo "${{ steps.juejin.outputs.md }}" >> README.md

          # 方式二：使用环境变量（后续步骤均可使用）
          echo "$JUEJIN_POST_MD" >> README.md
```

### 2. 输入说明

| 参数     | 必填 | 说明                    | 默认值 |
|----------|------|-------------------------|--------|
| `user_id` | 是  | 掘金用户 ID             | -      |
| `limit`   | 否  | 获取文章数量，范围 1-20 | 10     |

### 3. 输出说明

- **步骤输出** `outputs.md`：文章列表的 Markdown 字符串，可在后续步骤中通过 `steps.<id>.outputs.md` 使用。
- **环境变量** `JUEJIN_POST_MD`：与 `outputs.md` 内容相同，便于在 shell 中直接使用。

### 4. 输出示例

```markdown
#### 🤾‍ <a href="https://juejin.cn/user/4142615541064046" target="_blank">最近更新</a>
* <a href='https://juejin.cn/post/7091561831067566117' target='_blank'>测试文章2</a> - 2022/04/28 08:02
* <a href='https://juejin.cn/post/7091490504222703652' target='_blank'>测试文章</a> - 2022/04/28 03:25
```

## 如何获取掘金用户 ID

打开你的掘金个人主页，URL 中 `user/` 后面的数字即为用户 ID，例如：

- 链接：`https://juejin.cn/user/4142615541064046`
- 用户 ID：`4142615541064046`

## 开发与测试

```bash
pnpm install
pnpm run lint
pnpm run test
pnpm run prepare   # 构建 dist/
```

## License

MIT
