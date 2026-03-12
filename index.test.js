const process = require('process')
const cp = require('child_process')
const path = require('path')

function runAction(env = {}) {
  const ip = path.join(__dirname, 'index.js')
  return cp.execSync(`node ${ip}`, {
    env: { ...process.env, ...env },
    encoding: 'utf8',
  })
}

test('使用有效 user_id 时应成功执行并输出日志', () => {
  const result = runAction({
    INPUT_USER_ID: '4142615541064046',
    INPUT_LIMIT: '3',
  })
  expect(result).toBeDefined()
  expect(result).toMatch(/user_id|已获取|篇文章/)
})

test('user_id 为空时应失败并退出', () => {
  expect(() =>
    runAction({ INPUT_USER_ID: '' })
  ).toThrow()
})
