# 调试日志说明

> 插件内置了一个调试开关，用于在开发者控制台输出运行日志，便于排查问题。目前日志仅覆盖 **AI 查词** 相关流程，其他模块暂未输出。

## 如何开启

**设置 → Simple Wordbook → 常规 → 调试日志**，打开开关即可。

开启后按 `Ctrl/Cmd + Shift + I`（或 Obsidian 的「开发者工具」命令）打开控制台查看日志。

日志统一带 `[Simple Wordbook]` 前缀，格式为：

`[Simple Wordbook][模块名] 消息内容`

排查时可在控制台过滤 `Simple Wordbook`，屏蔽其他输出。

---

## 日志一览

### 模块：Settings

|触发时机|输出内容|
|---|---|
|开启调试日志开关| `debug log enabled` |

### 模块：AI

> **`callAI` 的触发方式：** 设置页「测试连接」、查词面板「AI 查询」、输入框按 `Shift + Enter`、编辑器中选中文字右键查词、AI 语境解释、命令面板执行查词命令。

#### 1. 设置页操作

|触发时机|输出内容|
|---|---|
|点击「测试连接」按钮| `test connection clicked` |

#### 2. 读取 API Key（`getApiKeyPlaintext`）

|触发时机|输出内容|
|---|---|
|进入读取流程| `getApiKeyPlaintext: mode= <模式>` |
|密钥链模式下 secretName 为空（未关联密钥）| `getApiKeyPlaintext: secretName empty` |
|官方密钥链读取成功| `getApiKeyPlaintext: secret_storage got= <bool> length= <长度>` |
|官方密钥链读取异常| `getApiKeyPlaintext: secret_storage read failed <错误对象>` |
|本地加密模式但无密文| `getApiKeyPlaintext: encryptedData empty` |
|本地加密解密成功| `getApiKeyPlaintext: local_encrypted got= <bool> length= <长度>` |
|模式字段异常| `getApiKeyPlaintext: unknown mode= <模式>` |

> `got` 表示是否成功读到密钥，`length` 是密钥长度，**不会输出密钥明文**。

#### 3. 调用 AI（`callAI`）

| 触发时机                  | 输出内容                                                                      |
| --------------------- | ------------------------------------------------------------------------- |
| 发起请求前                 | `callAI: provider= ... url= ... model= ... hasSystem= ... promptLen= ...` |
| 请求体构建完成               | `request body = <完整 JSON>`                                                |
| 请求被用户中断               | `fetch aborted`                                                           |
| HTTP 状态非 2xx          | `http error: status= <状态码> body= <响应文本>`                                  |
| 收到响应数据                | `response raw = <完整 JSON>`                                                |
| Anthropic 服务商响应内容块    | `anthropic blocks = <content 数组>`（仅 Anthropic）                            |

> 请求体（`request body`）里可看到 `messages`（含 system 和 user 内容）、`model`、`temperature` 等；
> 响应体（`response raw`）里可看到 `choices[0].message.content`、`usage`、`model` 等。

---

## 隐私提醒

调试日志可能包含：

- 你输入的查询词
- 笔记中的上下文原文（提示词使用了 `{context}` 占位符时）
- AI 返回的完整内容
- API 地址与模型名

**请勿将控制台日志公开分享。** 排查完成后建议及时关闭开关。

涉及 API Key 的日志只输出「是否存在」和「长度」，不会打印密钥明文。