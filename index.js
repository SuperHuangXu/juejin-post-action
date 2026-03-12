const core = require('@actions/core')
const superagent = require('superagent')
const dayjs = require('dayjs')
const { format } = require('util')

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 20

async function run() {
  try {
    const userId = core.getInput('user_id')
    const limitInput = core.getInput('limit')
    const limit = limitInput
      ? Math.min(Math.max(1, parseInt(limitInput, 10) || DEFAULT_LIMIT), MAX_LIMIT)
      : DEFAULT_LIMIT

    if (!userId || !userId.trim()) {
      core.setFailed('user_id 不能为空')
      return
    }

    core.info(`user_id: ${userId}, limit: ${limit}`)

    const res = await superagent
      .post('https://api.juejin.cn/content_api/v1/article/query_list')
      .send({
        user_id: userId.trim(),
        sort_type: 2,
        cursor: '0',
      })
      .timeout(15000)

    const data = res.body?.data
    if (!Array.isArray(data)) {
      core.setFailed('掘金 API 返回数据格式异常')
      return
    }

    const articleList = data
      .map((item) => item?.article_info)
      .filter(Boolean)
      .slice(0, limit)

    if (articleList.length === 0) {
      core.warning(`用户 ${userId} 暂无文章`)
      const md = format(
        `#### 🤾‍ <a href="https://juejin.cn/user/${userId}" target="_blank">最近更新</a>\n暂无文章`
      )
      core.setOutput('md', md)
      core.exportVariable('juejin_post_md', md)
      return
    }

    const itemMd = articleList
      .map(
        (article) =>
          `* <a href='https://juejin.cn/post/${
            article.article_id
          }' target='_blank'>${article.title || '无标题'}</a> - ${dayjs
            .unix(article.ctime || 0)
            .format('YYYY/MM/DD HH:mm')}`
      )
      .join('\n')

    const md = format(
      `#### 🤾‍ <a href="https://juejin.cn/user/${userId}" target="_blank">最近更新</a>
%s`,
      itemMd
    )

    core.setOutput('md', md)
    core.exportVariable('juejin_post_md', md)
    core.info(`已获取 ${articleList.length} 篇文章`)
  } catch (error) {
    core.setFailed(error.message || String(error))
  }
}

run()
