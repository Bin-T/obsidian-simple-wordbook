const { Plugin, ItemView, Notice, MarkdownRenderer, TFile, TFolder, Modal, Setting, FuzzySuggestModal, setIcon, normalizePath, PluginSettingTab, editorInfoField } = require('obsidian');
const { EditorView, Decoration, ViewPlugin } = require('@codemirror/view');
const { StateField, RangeSetBuilder, StateEffect } = require('@codemirror/state');

const VIEW_TYPE_SIDEBAR = "simple-wordbook-sidebar";
const VIEW_TYPE_LOOKUP = "simple-wordbook-lookup";

// ========== 国际化语言包 ==========
const locale = {
  en: {
    sidebar_title: "Sidebar",
    tab_learning: "Learning",
    tab_mastered: "Mastered",
    tab_ignored: "Ignored",
    search_placeholder: "Search words...",
    empty_state: "No words found.",
    no_definition: "No definition",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    delete_confirm: "Delete this word?",
    word_deleted: "Deleted {0}",
    delete_failed: "Delete failed",
    add_word_title: "Add Word",
    edit_word_title: "Edit Word",
    word_label: "Word",
    phonetic_label: "Phonetic",
    definition_label: "Definition",
    definition_placeholder: "**Definition**\ntake, get, spend; take\n\n---\n**Examples**\nI take the bus to work every day.\nIt takes me 30 minutes.\n\n---\n**Phrases**\ntake care of\ntake place\ntake part in",
    aliases_label: "Aliases (comma separated)",
    wordbook_label: "Wordbook File",
    card_color_label: "Card Color",
    color_default: "Default",
    color_red: "Red",
    color_orange: "Orange",
    color_yellow: "Yellow",
    color_green: "Green",
    color_blue: "Blue",
    color_purple: "Purple",
    color_pink: "Pink",
    color_cyan: "Cyan",
    save: "Save",
    cancel: "Cancel",
    word_required: "Word is required",
    select_wordbook: "Select a wordbook file",
    word_saved: "Word {0}",
    word_added: "added",
    word_updated: "updated",
    save_failed: "Failed to save",
    settings_wordbook_files: "Wordbook Files",
    settings_add_wordbook: "Add Wordbook File",
    settings_add_wordbook_desc: "Please add a .json wordbook file (empty or with correct format).",
    settings_mastery_mode: "Mastery/Ignore Mode",
    settings_mastery_mode_desc: "Choose whether mastery/ignore status is managed per-source or globally",
    mastery_mode_per_source: "Per-source",
    mastery_mode_global: "Global",
    settings_progress_management: "Mastery / Ignore Management",
    settings_mastery_mode_switched: "Mastery/Ignore Mode switched to: {0}",
    settings_mastery_file: "Mastery File",
    settings_mastery_path_desc: "Relative path to store mastered status",
    settings_ignored_file: "Ignored File",
    settings_ignored_path_desc: "Relative path to store ignored status",
    restore_default: "Restore Default",
    restore_default_tooltip: "Restore to the default path under the plugin folder",
    settings_highlight_preview: "Highlight & Preview",
    settings_enable_highlight: "Enable auto highlight",
    settings_highlight_color: "Highlight color",
    settings_highlight_color_desc: "Highlight color. 'Default' uses theme accent.",
    color_default_desc: "Default (theme accent)",
    settings_follow_card: "Follow card color",
    settings_follow_card_desc: "When ON, background highlight follows card color.",
    settings_underline_color: "Underline color (optional)",
    settings_underline_color_desc: "If set, underlines use this color (overrides highlight color).",
    underline_color_default: "Default (follow highlight color)",
    settings_enable_hover: "Enable hover preview",
    settings_blur_definitions: "Blur definitions",
    settings_blur_desc: "Blur definition content, reveal on hover",
    settings_highlight_styles: "Highlight styles",
    settings_style_underline_type: "Underline style",
    settings_style_none: "None",
    settings_style_solid: "Solid underline",
    settings_style_dashed: "Dashed underline",
    settings_style_dotted: "Dotted underline",
    settings_style_wavy: "Wavy underline",
    settings_style_double: "Double underline",
    settings_style_bold: "Bold",
    settings_pronunciation: "Pronunciation",
    settings_tts_template: "TTS URL template",
    settings_tts_desc: "Use {{word}}, {{type}}, {{accent}}",
    settings_variant: "Pronunciation variant",
    notice_no_json: "No JSON files found. Create a .json wordbook file first.",
    notice_file_already_added: "File already added",
    notice_deleted: "Deleted {0}",
    refresh_wordbook: "Refresh Wordbook",
    wordbook_refreshed: "Wordbook refreshed",
    toggle_readonly: "Click to toggle read-only",
    toggle_writable: "Click to toggle writable",
    word_count_loading: "Loading...",
    word_count: "({0} words)",
    word_count_error: "(?)",
    settings_scope_title: "Highlight Scope",
    settings_scope_highlight: "Highlight",
    settings_scope_highlight_desc: "When enabled, highlighting only applies to files matching the paths; when disabled, it applies to all files.",
    settings_scope_sidebar: "Sidebar Display",
    settings_scope_sidebar_desc: "When enabled, the sidebar only shows words from documents matching the paths; when disabled, shows words from all documents.",
    settings_scope_mode: "Scope Mode",
    settings_scope_mode_include: "Include only these paths",
    settings_scope_mode_exclude: "Exclude these paths",
    settings_scope_paths: "Path List",
    settings_scope_paths_desc: "One path per line. Markdown files must include the '.md' extension.",
    scope_paths_placeholder: "Folder/note.md\nFolder",
    settings_tab_files: "Files Management",
    settings_tab_general: "General Settings",
    command_open_settings: "Open Settings",
    lookup_view_title: "Lookup",
    lookup_input_placeholder: "Enter word or phrase...",
    lookup_empty_word: "Please enter a word or phrase to look up",
    lookup_search_button: "🔍",
    lookup_prompt_label: "Prompt:",
    lookup_default_prompt_option: "Default",
    lookup_loading: "Searching...",
    lookup_error_prefix: "Error: ",
    lookup_save_button: "Save Word",
    lookup_no_content: "No content to save",
    lookup_no_writable_book: "No writable wordbook file available",
    lookup_save_success: "Word saved",
    settings_tab_ai: "AI Config",
    settings_ai_provider: "Service Provider",
    settings_ai_provider_desc: "Select a preset provider or choose Custom",
    settings_ai_api_url: "API URL",
    settings_ai_api_key: "API Key",
    settings_ai_model: "Model Name",
    api_url_placeholder_custom: "Enter API URL",
    api_url_placeholder_preset: "Auto-filled",
    api_key_placeholder: "Enter API Key",
    api_model_placeholder: "Model name",
    settings_ai_default_prompt: "Default Prompt",
    settings_ai_default_prompt_desc: "Use {word} as placeholder for the word",
    settings_ai_custom_prompts: "Custom Prompts",
    settings_ai_custom_prompt_name: "Name",
    settings_ai_custom_prompt_content: "Prompt content",
    settings_ai_add_prompt: "Add Custom Prompt",
    settings_ai_delete_prompt: "Delete",
    settings_ai_cancel: "Cancel",
    settings_ai_test_connection: "Test Connection",
    settings_ai_test_button: "Test",
    settings_ai_test_success: "Connection successful! Received: {0}",
    settings_ai_test_fail: "Test failed: {0}",
    settings_ai_empty_name_or_content: "Name and content cannot be empty",
    settings_ai_duplicate_name: "Name already exists",
    editor_menu_lookup: "Lookup: {0}",
    command_lookup_prompt: "Lookup with prompt: {0}",
    settings_open_hotkeys: "Set Hotkeys",
    command_open_lookup: "Open Lookup Panel",
    api_error_network: "Network connection failed, please check your network or API URL",
    api_error_http: "API request failed ({0}): {1}",
    api_error_parse: "Invalid data format returned by API, please check API URL",
    api_error_unexpected: "Unexpected API response format, please check your API configuration",
    api_error_config: "Please configure API URL and API Key first",
    settings_enter_mode_local_only: "Local only",
    settings_enter_mode_ai_only: "AI only",
    settings_enter_mode_local_first: "Local first (then AI if not found)",
    local_not_found_ai_fallback: "Not found locally, showing AI result below",
    lookup_local_button: "Local Lookup",
    lookup_ai_button: "AI Lookup",
    lookup_no_local_match: "No match found in local wordbooks",
    lookup_clear_input: "Clear input",
    lookup_clear_output: "Clear output",
    lookup_settings_title: "Lookup Panel",
    lookup_enter_mode: "Enter mode",
    lookup_enter_mode_desc: "Choose what happens when pressing Enter in the search box",
    lookup_local_mode: "Local search mode",
    lookup_local_mode_desc: "Choose the matching method for local search",
    lookup_max_results: "Max results",
    lookup_max_results_desc: "Maximum number of results returned by local search (1-100)",
    lookup_mode_smart: "Smart (comprehensive ranking)",
    lookup_mode_exact: "Exact (only exact matches)",
    lookup_mode_prefix: "Prefix",
    lookup_mode_contains: "Contains",
    lookup_mode_fuzzy: "Fuzzy (allow spelling errors)",
    notice_open_editor: "Please open an editor and select a word",
    notice_select_word: "Please select a word or phrase",
    notice_word_not_found: 'Word "{0}" not found',
    notice_sidebar_not_ready: "Sidebar not ready",
    notice_prompt_empty: "Prompt cannot be empty",
    notice_readonly_cannot_edit: "This wordbook is read-only, cannot edit",
    notice_readonly_cannot_delete: "This wordbook is read-only, cannot delete",
    notice_readonly_cannot_save: "Selected wordbook is read-only, cannot save",
    notice_mastery_failed: "Failed to mark mastery, please check console for errors",
    notice_ignored_failed: "Failed to mark ignored, please check console for errors",
    notice_open_settings_failed: "Failed to open settings, please check console for errors",
    notice_invalid_number: "Please enter a number between 1 and 100",
    notice_card_data_not_found: "Card data for this word not found",
    notice_mastery_label_on: "Cancel Mastery",
    notice_mastery_label_off: "Mark as Mastered",
    notice_mastery_marked: 'Marked "{0}" as mastered',
    notice_mastery_unmarked: 'Unmarked "{0}" from mastered',
    notice_locate_label: "Locate in Sidebar",
    notice_file_readonly: '"{0}" set to read-only',
    notice_file_writable: '"{0}" set to writable',
    notice_loading_definition: "Loading definition...",
    match_label_exact: "Exact",
    match_label_prefix: "Prefix",
    match_label_contains: "Contains",
    match_label_fuzzy: "Fuzzy",
    match_label_alias_exact: "Alias Exact",
    match_label_alias_prefix: "Alias Prefix",
    match_label_alias_contains: "Alias Contains",
    match_label_alias_fuzzy: "Alias Fuzzy",
  },
  zh: {
    sidebar_title: "侧边栏显示",
    tab_learning: "学习",
    tab_mastered: "记住",
    tab_ignored: "忽略",
    search_placeholder: "搜索单词/短语...",
    empty_state: "没有找到单词。",
    no_definition: "无释义",
    edit: "编辑",
    delete: "删除",
    confirm: "确认",
    delete_confirm: "确定删除该单词吗？",
    word_deleted: "已删除 {0}",
    delete_failed: "删除失败",
    add_word_title: "添加单词/短语",
    edit_word_title: "编辑单词/短语",
    word_label: "单词",
    phonetic_label: "音标",
    definition_label: "释义",
    definition_placeholder: "**释义**\n拿，取；花费；采取\n\n---\n**例句**\nI take the bus to work every day.\nIt takes me 30 minutes.\n\n---\n**短语**\ntake care of\ntake place\ntake part in",
    aliases_label: "别名（用逗号分隔）",
    wordbook_label: "单词本文件",
    card_color_label: "卡片颜色",
    color_default: "默认",
    color_red: "红色",
    color_orange: "橙色",
    color_yellow: "黄色",
    color_green: "绿色",
    color_blue: "蓝色",
    color_purple: "紫色",
    color_pink: "粉色",
    color_cyan: "青色",
    save: "保存",
    cancel: "取消",
    word_required: "请输入单词",
    select_wordbook: "请选择一个单词本文件",
    word_saved: "单词已{0}",
    word_added: "添加",
    word_updated: "更新",
    save_failed: "保存失败",
    settings_wordbook_files: "单词本文件",
    settings_add_wordbook: "添加单词本文件",
    settings_add_wordbook_desc: "请添加一个空白/存有正确格式单词的 `.json` 单词本文件",
    settings_mastery_mode: "掌握/忽略模式",
    settings_mastery_mode_desc: "选择掌握/忽略状态是按词源独立管理还是全局统一",
    mastery_mode_per_source: "按词源独立",
    mastery_mode_global: "全局统一",
    settings_progress_management: "掌握/忽略管理",
    settings_mastery_mode_switched: "掌握/忽略模式已切换为：{0}",
    settings_mastery_file: "掌握状态文件",
    settings_mastery_path_desc: "存储已掌握状态的相对路径",
    settings_ignored_file: "忽略状态文件",
    settings_ignored_path_desc: "存储已忽略状态的相对路径",
    restore_default: "恢复默认",
    restore_default_tooltip: "恢复到插件文件夹下的默认路径",
    settings_highlight_preview: "高亮与预览",
    settings_enable_highlight: "启用自动高亮",
    settings_highlight_color: "高亮颜色",
    settings_highlight_color_desc: "高亮颜色，“默认”则使用主题强调色。",
    color_default_desc: "默认（主题强调色）",
    settings_follow_card: "跟随卡片颜色",
    settings_follow_card_desc: "开启后，背景高亮跟随侧边栏卡片颜色。",
    settings_underline_color: "下划线颜色（可选）",
    settings_underline_color_desc: "若设置，下划线将使用此颜色（覆盖高亮颜色）。",
    underline_color_default: "默认（跟随高亮颜色）",
    settings_enable_hover: "启用悬停预览",
    settings_blur_definitions: "模糊释义",
    settings_blur_desc: "默认模糊显示释义，悬停时清晰显示",
    settings_highlight_styles: "高亮样式",
    settings_style_underline_type: "下划线样式",
    settings_style_none: "无",
    settings_style_solid: "实线下划线",
    settings_style_dashed: "虚线下划线",
    settings_style_dotted: "点状下划线",
    settings_style_wavy: "波浪下划线",
    settings_style_double: "双下划线",
    settings_style_bold: "粗体",
    settings_pronunciation: "发音设置",
    settings_tts_template: "TTS 地址模板",
    settings_tts_desc: "可使用 {{word}}, {{type}}, {{accent}} 占位符",
    settings_variant: "发音偏好",
    notice_no_json: "未找到 JSON 文件。请先创建一个 .json 单词本文件。",
    notice_file_already_added: "文件已添加过",
    notice_deleted: "已删除 {0}",
    refresh_wordbook: "刷新单词本",
    wordbook_refreshed: "单词本已刷新",
    toggle_readonly: "点击切换为只读",
    toggle_writable: "点击切换为可写",
    word_count_loading: "加载中...",
    word_count: "（{0} 个单词）",
    word_count_error: "(?)",
    settings_scope_title: "高亮范围",
    settings_scope_highlight: "高亮",
    settings_scope_highlight_desc: "开启后，高亮仅作用于匹配路径的文件；关闭后，高亮作用于所有文件。",
    settings_scope_sidebar: "侧边栏显示",
    settings_scope_sidebar_desc: "开启后，侧边栏仅显示匹配路径的文档中的单词；关闭后，显示所有文档的单词。",
    settings_scope_mode: "高亮模式",
    settings_scope_mode_include: "仅包含以下路径",
    settings_scope_mode_exclude: "仅排除以下路径",
    settings_scope_paths: "路径列表",
    settings_scope_paths_desc: "每行一个路径。Markdown 文件必须包含 '.md' 后缀。",
    scope_paths_placeholder: "文件夹/笔记.md\n文件夹",
    settings_tab_files: "文件管理",
    settings_tab_general: "常规设置",
    command_open_settings: "打开设置",
    lookup_view_title: "查词面板",
    lookup_input_placeholder: "输入单词或短语...",
    lookup_empty_word: "请输入要查询的单词/短语",
    lookup_search_button: "🔍",
    lookup_prompt_label: "提示词：",
    lookup_default_prompt_option: "默认",
    lookup_loading: "正在查询...",
    lookup_error_prefix: "错误：",
    lookup_save_button: "保存单词",
    lookup_no_content: "没有可保存的内容",
    lookup_no_writable_book: "没有可写的单词本文件",
    lookup_save_success: "单词已保存",
    settings_tab_ai: "AI 配置",
    settings_ai_provider: "服务提供商",
    settings_ai_provider_desc: "选择预设服务商或自定义",
    settings_ai_api_url: "API 地址",
    settings_ai_api_key: "API 密钥",
    settings_ai_model: "模型名称",
    api_url_placeholder_custom: "请输入 API 地址",
    api_url_placeholder_preset: "自动填充",
    api_key_placeholder: "请输入 API Key",
    api_model_placeholder: "模型名称",
    settings_ai_default_prompt: "默认提示词",
    settings_ai_default_prompt_desc: "使用 {word} 作为单词占位符",
    settings_ai_custom_prompts: "自定义提示词",
    settings_ai_custom_prompt_name: "名称",
    settings_ai_custom_prompt_content: "提示词内容",
    settings_ai_add_prompt: "添加自定义提示词",
    settings_ai_delete_prompt: "删除",
    settings_ai_cancel: "取消",
    settings_ai_test_connection: "测试连接",
    settings_ai_test_button: "测试",
    settings_ai_test_success: "连接成功！返回内容：{0}",
    settings_ai_test_fail: "测试失败：{0}",
    settings_ai_empty_name_or_content: "名称和内容不能为空",
    settings_ai_duplicate_name: "名称已存在",
    editor_menu_lookup: "查词：{0}",
    command_lookup_prompt: "查词提示词：{0}",
    settings_open_hotkeys: "设置快捷键",
    command_open_lookup: "打开查词面板",
    api_error_network: "网络连接失败，请检查网络或 API 地址是否正确",
    api_error_http: "API 请求失败 ({0}): {1}",
    api_error_parse: "API 返回的数据格式无效，请检查 API 地址是否正确",
    api_error_unexpected: "API 返回了意外格式，请检查 API 配置是否正确",
    api_error_config: "请先配置 API 地址和密钥",
    settings_enter_mode_local_only: "仅本地",
    settings_enter_mode_ai_only: "仅 AI",
    settings_enter_mode_local_first: "本地优先（未找到再调用 AI）",
    local_not_found_ai_fallback: "本地未找到，以下为 AI 查询结果",
    lookup_local_button: "本地查询",
    lookup_ai_button: "AI查询",
    lookup_no_local_match: "未在本地词库中找到该单词",
    lookup_clear_input: "清空输入",
    lookup_clear_output: "清空输出",
    lookup_settings_title: "查词面板",
    lookup_enter_mode: "回车模式",
    lookup_enter_mode_desc: "选择在搜索框中按回车时的行为",
    lookup_local_mode: "本地查询模式",
    lookup_local_mode_desc: "选择本地查询的匹配方式",
    lookup_max_results: "最大结果数",
    lookup_max_results_desc: "本地查询最多返回的结果数量（1-100）",
    lookup_mode_smart: "智能匹配（综合排序）",
    lookup_mode_exact: "精准匹配（仅完全一致）",
    lookup_mode_prefix: "前缀匹配",
    lookup_mode_contains: "包含匹配",
    lookup_mode_fuzzy: "模糊匹配（允许拼写错误）",
    notice_open_editor: "请先打开一个编辑器并选中单词",
    notice_select_word: "请选中一个单词或短语",
    notice_word_not_found: '未找到单词 "{0}"',
    notice_sidebar_not_ready: "侧边栏未就绪",
    notice_prompt_empty: "提示词不能为空",
    notice_readonly_cannot_edit: "该单词本为只读，无法编辑",
    notice_readonly_cannot_delete: "该单词本为只读，无法删除",
    notice_readonly_cannot_save: "所选单词本为只读，无法保存",
    notice_mastery_failed: "标记掌握失败，请查看控制台错误",
    notice_ignored_failed: "标记忽略失败，请查看控制台错误",
    notice_open_settings_failed: "打开设置失败，请查看控制台错误",
    notice_invalid_number: "请输入 1-100 之间的数字",
    notice_card_data_not_found: "未找到该单词的卡片数据",
    notice_mastery_label_on: "取消掌握",
    notice_mastery_label_off: "标记掌握",
    notice_mastery_marked: '已标记 "{0}" 为掌握',
    notice_mastery_unmarked: '已取消 "{0}" 的掌握',
    notice_locate_label: "在侧边栏定位",
    notice_file_readonly: '"{0}" 已设为只读',
    notice_file_writable: '"{0}" 已设为可写',
    notice_loading_definition: "加载释义中...",
    match_label_exact: "精准",
    match_label_prefix: "前缀",
    match_label_contains: "包含",
    match_label_fuzzy: "模糊",
    match_label_alias_exact: "别名精准",
    match_label_alias_prefix: "别名前缀",
    match_label_alias_contains: "别名包含",
    match_label_alias_fuzzy: "别名模糊",
  }
};


// 轻量级语言工具
function getLocale() {
  const lang = window.localStorage.getItem("language") || "en";
  return lang.startsWith("zh") ? locale.zh : locale.en;
}
function t(key, ...args) {
  let text = getLocale()[key] || key;
  for (let i = 0; i < args.length; i++) text = text.replace(`{${i}}`, args[i]);
  return text;
}


const DEFAULT_SETTINGS = {
  wordbookFiles: [],
  masteryMode: "global",  // 可选 "per-source" 或 "global"
  masteryFilePath: "",
  ignoredFilePath: "",
  enableHighlight: true,
  enableHoverPreview: true,
  enableBlurDefinition: false,
  enableMastery: true,
  highlightColor: "",
  underlineColor: "",
  followCardColor: true,
  highlightStyles: {
    underlineType: "none",
    bold: false
  },
  enableHighlightScopeFilter: false,
  enableSidebarScopeFilter: false,
  scopeMode: "include",
  scopePaths: [],
  ttsUrlTemplate: "https://dict.youdao.com/dictvoice?audio={{word}}&type=2",
  pronunciationVariant: "us",
  enterMode: "local_only",  // 可选 "local_only", "ai_only", "local_first"
  localSearchMode: "smart",    // "smart", "exact", "prefix", "contains", "fuzzy"
  maxLocalResults: 10,         // 默认改为10

  // ===== AI 查词设置 =====
  apiProvider: "openai",
  apiBaseUrl: "https://api.openai.com/v1/chat/completions",
  apiKey: "",
  apiModel: "gpt-3.5-turbo",
  defaultPrompt: "用中文解释单词 {word}的释义。",
  customPrompts: [],          // [{ name: "快速释义", content: "给出 {word} 的中文释义" }]
  selectedPrompt: "默认",     // 当前选中的提示词名称

  selectedSourceMap: {}
};

function normalizeWord(word) { return word.trim().toLowerCase(); }
function getStudyKey(word, bookPath) {
  const normalized = normalizeWord(word);
  const plugin = globalThis.__simpleWordbookPlugin;
  if (plugin && plugin.settings.masteryMode === "global") {
    return normalized;
  }
  return `${bookPath}::${normalized}`;
}

async function playPronunciation(word, ttsTemplate, variant) {
  let url = ttsTemplate.replace(/{{word}}/g, encodeURIComponent(word));
  if (url.includes("{{type}}")) {
    const type = variant === "uk" ? "1" : "2";
    url = url.replace(/{{type}}/g, type);
  }
  if (url.includes("{{accent}}")) url = url.replace(/{{accent}}/g, variant);
  try {
    const audio = new Audio(url);
    await audio.play();
  } catch (e) { console.warn("Playback failed", e); }
}

// ========== 编辑距离（Levenshtein Distance）用于模糊匹配 ==========
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

// ========== 解析多段落定义 ==========
function parseSections(definition) {
  if (!definition || !definition.trim()) return [];
  const parts = definition.split(/\n---\s*\n/);
  const sections = [];
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const titleMatch = trimmed.match(/^\*\*(.+?)\*\*\s*/);
    let title, content;
    if (titleMatch) {
      title = titleMatch[1].trim();
      content = trimmed.substring(titleMatch[0].length).trim();
    } else {
      title = sections.length === 0 ? "释义" : `内容 ${sections.length + 1}`;
      content = trimmed;
    }
    sections.push({ title, content });
  }
  return sections;
}

function processLineBreaks(text) {
  if (!text) return text;
  return text.replace(/(?<!\n)\n(?!\n)/g, '  \n');
}

// ========== 修复内部链接（支持完整 Obsidian 原生组合键行为） ==========
function fixInternalLinks(container, app, sourcePath) {
  if (!container) return;
  container.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    // 仅处理内部链接（非 http/https 开头，且不为空或 "#"）
    if (href && !/^https?:\/\//i.test(href) && href !== '#') {
      a.removeEventListener('click', clickHandler);
      a.removeEventListener('auxclick', auxClickHandler);
      a.addEventListener('click', clickHandler);
      a.addEventListener('auxclick', auxClickHandler);
      a.style.cursor = 'pointer';
    }
  });

  // 核心打开逻辑
  async function openLink(e, linkText, forceNewTab = false) {
    const isCtrlCmd = e.ctrlKey || e.metaKey;
    const isAlt = e.altKey;
    const isShift = e.shiftKey;

    try {
      if (isCtrlCmd && isShift && isAlt) {
        // Ctrl/Cmd + Shift + Alt → 全新独立窗口
        const leaf = app.workspace.getLeaf('window');
        await leaf.openLinkText(linkText, sourcePath);
        app.workspace.setActiveLeaf(leaf, { focus: true });
      } else if (isCtrlCmd && isAlt) {
        // Ctrl/Cmd + Alt → 右侧分屏（在当前活动叶子右侧分割）
        const leaf = app.workspace.getLeaf('split');
        await leaf.openLinkText(linkText, sourcePath);
        app.workspace.setActiveLeaf(leaf, { focus: true });
      } else if (isCtrlCmd || forceNewTab) {
        // Ctrl/Cmd 或 中键（forceNewTab）→ 新标签页
        app.workspace.openLinkText(linkText, sourcePath, true);
      } else {
        // 普通左键 → 当前标签页
        app.workspace.openLinkText(linkText, sourcePath, false);
      }
    } catch (err) {
      console.warn('Failed to open link:', linkText, err);
    }
  }

  // 左键点击处理器
  async function clickHandler(e) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const linkText = e.currentTarget.getAttribute('href');
    if (!linkText) return;
    await openLink(e, linkText);
  }

  // 中键点击处理器
  async function auxClickHandler(e) {
    if (e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      const linkText = e.currentTarget.getAttribute('href');
      if (!linkText) return;
      await openLink(e, linkText, true);
    }
  }
}

// ========== Trie ==========
class WordTrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
    this.payloads = [];
    this.words = [];
  }
}

class WordTrie {
  constructor() {
    this.root = new WordTrieNode();
  }

  addWord(word, payload) {
    let node = this.root;
    const lowerWord = word.toLowerCase();
    for (const ch of lowerWord) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new WordTrieNode());
      }
      node = node.children.get(ch);
    }
    if (!node.isEnd) {
      node.isEnd = true;
    }
    if (!node.payloads.includes(payload)) {
      node.payloads.push(payload);
      node.words.push(word);
    }
  }

  findAllMatches(text) {
    const matches = [];
    const lowerText = text.toLowerCase();
    for (let i = 0; i < lowerText.length; i++) {
      let node = this.root;
      let j = i;
      while (j < lowerText.length && node.children.has(lowerText[j])) {
        node = node.children.get(lowerText[j]);
        j++;
        if (node.isEnd) {
          const matchedWord = node.words[0] || '';
          const hasNonWordChar = /[^\w]/.test(matchedWord);
          let isStartBoundary = true, isEndBoundary = true;
          if (!hasNonWordChar) {
            const beforeChar = i > 0 ? lowerText[i-1] : '';
            const afterChar = j < lowerText.length ? lowerText[j] : '';
            isStartBoundary = !/[a-z0-9_]/i.test(beforeChar);
            isEndBoundary = !/[a-z0-9_]/i.test(afterChar);
          }
          if (isStartBoundary && isEndBoundary) {
            matches.push({
              from: i,
              to: j,
              payloads: node.payloads.slice()
            });
          }
        }
      }
    }

    const uniqueMap = new Map();
    for (const m of matches) {
      const key = `${m.from}-${m.to}`;
      if (uniqueMap.has(key)) {
        const existing = uniqueMap.get(key);
        for (const p of m.payloads) {
          if (!existing.payloads.includes(p)) {
            existing.payloads.push(p);
          }
        }
      } else {
        uniqueMap.set(key, m);
      }
    }
    const uniqueMatches = Array.from(uniqueMap.values());

    uniqueMatches.sort((a, b) => a.from - b.from || (b.to - b.from) - (a.to - a.from));
    const result = [];
    let lastTo = -1;
    for (const m of uniqueMatches) {
      if (m.from >= lastTo) {
        result.push(m);
        lastTo = m.to;
      }
    }
    return result;
  }

  clear() {
    this.root = new WordTrieNode();
  }
}

// ========== 词库解析 ==========
class WordbookParser {
  static cleanCardForStorage(card, defaultSource = "") {
    return {
      word: card.word || "",
      aliases: card.aliases || [],
      phonetic: card.phonetic || "",
      definition: card.definition || "",
      color: card.color || "",
      sourceFile: card.sourceFile || defaultSource
    };
  }

  static async parseFile(app, filePath) {
    const file = app.vault.getAbstractFileByPath(filePath);
    if (!file || !(file instanceof TFile)) return [];
    const content = await app.vault.read(file);
    let data; 
    try { data = JSON.parse(content); } 
    catch(e) { return []; }
    if (!Array.isArray(data)) return [];
    return data.filter(c => c.word && typeof c.word === 'string').map(card => {
      const def = card.definition || "";
      const sections = parseSections(def);
      return {
        word: card.word,
        aliases: card.aliases || [],
        definition: def,
        color: card.color || "",
        sourceFile: filePath,
        sections: sections.length > 0 ? sections : [{ title: "释义", content: def }],
        phonetic: card.phonetic || ""
      };
    });
  }
  
  static async saveCard(app, filePath, card, isNew) {
    let cards = await this.parseFile(app, filePath);
    cards = cards.map(c => this.cleanCardForStorage(c, filePath));
    const newCard = this.cleanCardForStorage(card, filePath);
    if (isNew) {
      cards.push(newCard);
    } else {
      const idx = cards.findIndex(c => c.word === newCard.word);
      if (idx !== -1) cards[idx] = newCard;
      else cards.push(newCard);
    }
    const file = app.vault.getAbstractFileByPath(filePath);
    await app.vault.modify(file, JSON.stringify(cards, null, 2));
    await new Promise(r => setTimeout(r, 100));
  }
  
  static async deleteCard(app, filePath, word) {
    let cards = await this.parseFile(app, filePath);
    cards = cards.map(c => this.cleanCardForStorage(c, filePath));
    const filtered = cards.filter(c => c.word !== word);
    if (filtered.length === cards.length) return false;
    const file = app.vault.getAbstractFileByPath(filePath);
    await app.vault.modify(file, JSON.stringify(filtered, null, 2));
    return true;
  }
}

// ========== 掌握状态存储 ==========
class MasteryStore {
  constructor(plugin) { 
    this.plugin = plugin; 
    this.masteryData = {}; 
    this.ignoredData = {}; 
  }

  // ----- 获取路径（规范化） -----
  getMasteryFilePath() {
    const path = this.plugin.settings.masteryFilePath || "_wordbook_mastery.json";
    return normalizePath(path);
  }
  getIgnoredFilePath() {
    const path = this.plugin.settings.ignoredFilePath || "_wordbook_ignored.json";
    return normalizePath(path);
  }

  // ----- 加载（使用 adapter） -----
  async load() {
    const adapter = this.plugin.app.vault.adapter;
    const masteryPath = this.getMasteryFilePath();
    const ignoredPath = this.getIgnoredFilePath();

    // 加载掌握状态
    if (await adapter.exists(masteryPath)) {
      try {
        const content = await adapter.read(masteryPath);
        if (content && content.trim() !== "") {
          this.masteryData = JSON.parse(content);
        } else {
          this.masteryData = {};
        }
      } catch (e) {
        console.error("Failed to parse mastery file:", e);
        this.masteryData = {};
      }
    } else {
      this.masteryData = {};
    }

    // 加载忽略状态
    if (await adapter.exists(ignoredPath)) {
      try {
        const content = await adapter.read(ignoredPath);
        if (content && content.trim() !== "") {
          this.ignoredData = JSON.parse(content);
        } else {
          this.ignoredData = {};
        }
      } catch (e) {
        console.error("Failed to parse ignored file:", e);
        this.ignoredData = {};
      }
    } else {
      this.ignoredData = {};
    }

    await this.migrateIgnoredFromMastery();
  }

  // ----- 从词源独立迁移到全局（合并，忽略优先）-----
  async migrateFromPerSourceToGlobal() {
    const mergedMastery = {};
    const mergedIgnored = {};
    // 收集所有词源 key
    for (const key of Object.keys(this.masteryData)) {
      if (key.includes('::')) {
        const word = key.split('::')[1];
        const isMastered = this.masteryData[key]?.mastered === true;
        if (isMastered && !mergedIgnored[word]) {
          // 如果尚未被忽略，则标记为掌握
          if (!mergedMastery[word]) mergedMastery[word] = true;
        }
      }
    }
    for (const key of Object.keys(this.ignoredData)) {
      if (key.includes('::')) {
        const word = key.split('::')[1];
        const isIgnored = this.ignoredData[key]?.ignored === true;
        if (isIgnored) {
          mergedIgnored[word] = true;
          delete mergedMastery[word]; // 忽略优先
        }
      }
    }
    // 写入全局 key
    for (const word of Object.keys(mergedMastery)) {
      if (!mergedIgnored[word]) {
        if (!this.masteryData[word]) this.masteryData[word] = {};
        this.masteryData[word].mastered = true;
        this.masteryData[word].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
      }
    }
    for (const word of Object.keys(mergedIgnored)) {
      if (!this.ignoredData[word]) this.ignoredData[word] = {};
      this.ignoredData[word].ignored = true;
      this.ignoredData[word].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
      // 同时清除可能存在的掌握 key
      if (this.masteryData[word]) delete this.masteryData[word];
    }
    await this.saveMastery();
    await this.saveIgnored();
  }

  // ----- 从全局迁移到词源独立（补全缺失的词源 key，不覆盖已有）-----
  async migrateFromGlobalToPerSource() {
    const books = this.plugin.settings.wordbookFiles
      .filter(b => b.enabled)
      .map(b => b.path);
    if (books.length === 0) return;

    // 收集所有词源 key 的单词（用于判断是否已存在）
    const existingWordsPerBook = new Map();
    for (const key of Object.keys(this.masteryData)) {
      if (key.includes('::')) {
        const [bookPath, word] = key.split('::');
        if (!existingWordsPerBook.has(bookPath)) existingWordsPerBook.set(bookPath, new Set());
        existingWordsPerBook.get(bookPath).add(word);
      }
    }
    for (const key of Object.keys(this.ignoredData)) {
      if (key.includes('::')) {
        const [bookPath, word] = key.split('::');
        if (!existingWordsPerBook.has(bookPath)) existingWordsPerBook.set(bookPath, new Set());
        existingWordsPerBook.get(bookPath).add(word);
      }
    }

    // 遍历所有全局 key
    const globalKeys = new Set();
    for (const key of Object.keys(this.masteryData)) {
      if (!key.includes('::')) globalKeys.add(key);
    }
    for (const key of Object.keys(this.ignoredData)) {
      if (!key.includes('::')) globalKeys.add(key);
    }

    for (const word of globalKeys) {
      const isMastered = this.masteryData[word]?.mastered === true;
      const isIgnored = this.ignoredData[word]?.ignored === true;
      if (!isMastered && !isIgnored) continue;

      for (const bookPath of books) {
        const sourceKey = `${bookPath}::${word}`;
        // 检查该词源 key 是否已存在
        const exists = existingWordsPerBook.get(bookPath)?.has(word);
        if (!exists) {
          // 不存在则创建
          if (isIgnored) {
            if (!this.ignoredData[sourceKey]) this.ignoredData[sourceKey] = {};
            this.ignoredData[sourceKey].ignored = true;
            this.ignoredData[sourceKey].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
          } else if (isMastered) {
            if (!this.masteryData[sourceKey]) this.masteryData[sourceKey] = {};
            this.masteryData[sourceKey].mastered = true;
            this.masteryData[sourceKey].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
          }
        }
      }
    }
    await this.saveMastery();
    await this.saveIgnored();
  }

  // ----- 迁移旧数据（保持不变） -----
  async migrateIgnoredFromMastery() {
    let migrated = false;
    for (const key in this.masteryData) {
      if (this.masteryData[key]?.ignored === true) {
        this.ignoredData[key] = { ignored: true, updatedAt: this.masteryData[key].updatedAt };
        delete this.masteryData[key].ignored;
        migrated = true;
      }
    }
    if (migrated) { 
      await this.saveMastery(); 
      await this.saveIgnored(); 
    }
  }

  // ----- 保存掌握（使用 adapter） -----
  async saveMastery() {
    const path = this.getMasteryFilePath();
    const adapter = this.plugin.app.vault.adapter;
    try {
      const dir = path.substring(0, path.lastIndexOf('/'));
      if (dir && !(await adapter.exists(dir))) {
        await adapter.mkdir(dir, { recursive: true });
      }

      if (Object.keys(this.masteryData).length === 0) {
        if (await adapter.exists(path)) {
          await adapter.remove(path);
        }
        return;
      }

      const data = JSON.stringify(this.masteryData, null, 2);
      await adapter.write(path, data);
    } catch (e) {
      console.error("Error saving mastery file:", e);
      throw e;
    }
  }

  // ----- 保存忽略（使用 adapter） -----
  async saveIgnored() {
    const path = this.getIgnoredFilePath();
    const adapter = this.plugin.app.vault.adapter;
    try {
      const dir = path.substring(0, path.lastIndexOf('/'));
      if (dir && !(await adapter.exists(dir))) {
        await adapter.mkdir(dir, { recursive: true });
      }

      if (Object.keys(this.ignoredData).length === 0) {
        if (await adapter.exists(path)) {
          await adapter.remove(path);
        }
        return;
      }

      const data = JSON.stringify(this.ignoredData, null, 2);
      await adapter.write(path, data);
    } catch (e) {
      console.error("Error saving ignored file:", e);
      throw e;
    }
  }

  // ----- 状态查询 -----
  isMastered(key) { return this.masteryData[key]?.mastered === true; }
  isIgnored(key) { return this.ignoredData[key]?.ignored === true; }

  // ----- 标记掌握（带错误处理） -----
  async setMastered(key, mastered) {
    try {
      if (mastered) {
        await this.setIgnored(key, false);
        if (!this.masteryData[key]) this.masteryData[key] = {};
        this.masteryData[key].mastered = true;
        this.masteryData[key].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
      } else {
        if (this.masteryData[key]) delete this.masteryData[key];
      }
      await this.saveMastery();
    } catch (e) {
      console.error("Failed to set mastered:", e);
      new Notice(t("notice_mastery_failed"));
    }
  }

  // ----- 标记忽略（带错误处理） -----
  async setIgnored(key, ignored) {
    try {
      if (ignored) {
        await this.setMastered(key, false);
        if (!this.ignoredData[key]) this.ignoredData[key] = {};
        this.ignoredData[key].ignored = true;
        this.ignoredData[key].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
      } else {
        if (this.ignoredData[key]) delete this.ignoredData[key];
      }
      await this.saveIgnored();
    } catch (e) {
      console.error("Failed to set ignored:", e);
      new Notice(t("notice_ignored_failed"));
    }
  }
}

// ========== 高亮核心 ==========
class Highlighter {
  constructor(plugin) {
    this.plugin = plugin;
    this.wordTrie = new WordTrie();
    this.decorationField = null;
    this.pdfObserver = null;
    this.REFRESH_EFFECT = StateEffect.define();
    this.CLEAR_EFFECT = StateEffect.define();
    this.debounceTimer = null;
    this._pdfContainers = new Set();
    this._pdfRefreshTimer = null;
    this._textLayerObserver = null;
    this._intersectionObserver = null;
    this._observedLayers = new WeakSet();
    this._matchCache = new WeakMap();
    this._globalScrollHandler = null;
    this._currentEditorPath = null;   // ★ 缓存当前编辑器的文件路径
  }

  // ---------- 样式辅助 ----------
  getHighlightClasses() {
    const styles = this.plugin.settings.highlightStyles;
    const classes = ['simple-wordbook-highlight'];
    const underline = styles.underlineType;
    if (underline === 'solid') classes.push('hi-underline');
    else if (underline === 'dashed') classes.push('hi-dashed');
    else if (underline === 'dotted') classes.push('hi-dotted');
    else if (underline === 'wavy') classes.push('hi-wavy');
    else if (underline === 'double') classes.push('hi-double');
    classes.push('hi-background');
    if (styles.bold) classes.push('hi-bold');
    return classes.join(' ');
  }

  getMainColor(wordColor) {
    if (this.plugin.settings.followCardColor) {
      if (wordColor) return `var(--color-${wordColor})`;
      return 'var(--interactive-accent)';
    } else {
      const custom = this.plugin.settings.highlightColor;
      if (custom && custom.trim()) return custom;
      return 'var(--interactive-accent)';
    }
  }

  getUnderlineColor(wordColor) {
    const customUnderline = this.plugin.settings.underlineColor;
    if (customUnderline && customUnderline.trim()) return customUnderline;
    return this.getMainColor(wordColor);
  }

  // ---------- 路径范围辅助 ----------
  getPathForContainer(container) {
    if (!container) return null;
    // 方法1: 通过closest leaf
    let leaf = container.closest?.('.workspace-leaf');
    if (leaf && leaf.view && leaf.view.file) {
      return leaf.view.file.path;
    }
    // 方法2: 遍历所有 markdown leaves 查找包含该容器的 leaf
    const leaves = this.plugin.app.workspace.getLeavesOfType('markdown');
    for (const lf of leaves) {
      if (lf.view && lf.view.containerEl && lf.view.containerEl.contains(container)) {
        return lf.view.file?.path || null;
      }
    }
    // 方法3: 若为阅读/预览视图，且属于活动 leaf，则使用活动文件
    if (container.closest?.('.markdown-preview-view') || container.closest?.('.markdown-reading-view')) {
      const activeFile = this.plugin.app.workspace.getActiveFile();
      const activeLeaf = this.plugin.app.workspace.activeLeaf;
      if (activeLeaf && activeLeaf.view && activeLeaf.view.containerEl.contains(container)) {
        return activeFile?.path || null;
      }
    }
    // PDF 处理保持不变
    if (container.closest?.('.pdf-viewer') || container.closest?.('.mod-pdf') || container.querySelector('iframe')) {
      const activeFile = this.plugin.app.workspace.getActiveFile();
      if (activeFile && activeFile.extension === 'pdf') {
        return activeFile.path;
      }
    }
    return null;
  }

  isPathInScope(filePath) {
    if (!filePath) return false;
    const { enableHighlightScopeFilter, scopeMode, scopePaths } = this.plugin.settings;
    if (!enableHighlightScopeFilter || !scopePaths || scopePaths.length === 0) return true;
    const normalizedPath = normalizePath(filePath).toLowerCase();
    const matches = scopePaths.some(p => {
      let normalizedP = normalizePath(p).toLowerCase();
      if (!normalizedP.endsWith('/')) {
        const abstractFile = this.plugin.app.vault.getAbstractFileByPath(p);
        if (abstractFile instanceof TFolder) normalizedP += '/';
      }
      if (normalizedP.endsWith('/')) {
        return normalizedPath.startsWith(normalizedP);
      } else {
        return normalizedPath === normalizedP;
      }
    });
    return scopeMode === "include" ? matches : !matches;
  }

  shouldHighlightPath(filePath) {
    if (!this.plugin.settings.enableHighlight) return false;
    const filterEnabled = this.plugin.settings.enableHighlightScopeFilter;
    const paths = this.plugin.settings.scopePaths;
    if (!filterEnabled || !paths || paths.length === 0) return true;
    if (!filePath) return false;
    return this.isPathInScope(filePath);
  }

  // ---------- 选择卡片 ----------
  selectCardFromPayloads(payloads, currentFilePath) {
    if (!payloads || payloads.length === 0) return null;
    if (currentFilePath) {
      let card = payloads.find(c => c.sourceFile === currentFilePath);
      if (card) return card;
    }
    const wordKey = payloads[0].word.toLowerCase();
    const preferredSource = this.plugin.settings.selectedSourceMap?.[wordKey];
    let card = payloads.find(c => c.sourceFile === preferredSource);
    if (card) return card;
    return payloads[0];
  }

  // ---------- 清除高亮 ----------
  async clearAllHighlights() {
    const containers = document.querySelectorAll('.markdown-preview-view, .markdown-reading-view');
    for (const container of containers) {
      if (container instanceof HTMLElement) this.clearHighlights(container);
    }
    if (this.decorationField) {
      this.plugin.app.workspace.iterateCodeMirrors(cm => {
        if (cm && cm.state) cm.dispatch({ effects: this.CLEAR_EFFECT.of(null) });
      });
    }
    const pdfHighlights = document.querySelectorAll('.simple-wordbook-pdf-highlight');
    pdfHighlights.forEach(el => el.remove());
  }

  clearHighlights(container) {
    const spans = container.querySelectorAll('.simple-wordbook-highlight');
    for (const span of spans) {
      const parent = span.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize();
      }
    }
  }

  // ---------- Trie 重建 ----------
  async rebuildTrie() {
    this.wordTrie.clear();
    const allCards = this.plugin.getAllCards();
    const mastery = this.plugin.masteryStore;
    for (const card of allCards) {
      const key = getStudyKey(card.word, card.sourceFile);
      if (!mastery.isMastered(key) && !mastery.isIgnored(key)) {
        this.wordTrie.addWord(card.word, card);
        if (card.aliases) card.aliases.forEach(a => a && this.wordTrie.addWord(a, card));
      }
    }
    this._trieVersion = (this._trieVersion || 0) + 1;

    // ★ 清空匹配缓存（词库变化后旧缓存无效）
    if (this._matchCache) {
      this._matchCache = new WeakMap();
    }
  }

  debouncedRefresh() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.refresh(), 100);
  }

  // ---------- 主刷新入口 ----------
  async refresh() {
    if (!this.plugin.settings.enableHighlight) {
      await this.clearAllHighlights();
      return;
    }
    await this.rebuildTrie();
    requestAnimationFrame(() => {
      this.applyToMarkdownPreviews();
      // 多次延迟重试，确保手机端渲染完成
      setTimeout(() => this.applyToMarkdownPreviews(), 150);
      setTimeout(() => this.applyToMarkdownPreviews(), 400);
      setTimeout(() => this.applyToMarkdownPreviews(), 800);
    });
    // 编辑模式刷新
    if (this.decorationField) {
      // 1. 更新缓存路径
      const activeFile = this.plugin.app.workspace.getActiveFile();
      if (activeFile) this._currentEditorPath = activeFile.path;

      // 2. 获取所有 Markdown 叶子，遍历其编辑器
      const markdownLeaves = this.plugin.app.workspace.getLeavesOfType('markdown');
      for (const leaf of markdownLeaves) {
        const view = leaf.view;
        if (!view || !view.editor) continue;
        const cm = view.editor.cm;
        if (!cm || !cm.state) continue;

        // 派发刷新效果，附带当前选区
        cm.dispatch({
          effects: this.REFRESH_EFFECT.of(null),
          selection: cm.state.selection
        });
        // 强制重绘
        if (cm.requestMeasure) cm.requestMeasure();

        // 额外空事务，确保更新被处理
        cm.dispatch({});
      }
    }
    this.applyToPDFs(0);
    this.plugin.app.workspace.trigger("simple-wordbook:highlighter-updated");
  }

  // ---------- 阅读模式高亮 ----------
  applyToMarkdownPreviews() {
    const containers = document.querySelectorAll('.markdown-preview-view, .markdown-reading-view');
    const activeFile = this.plugin.app.workspace.getActiveFile();
    const activeLeaf = this.plugin.app.workspace.activeLeaf;

    for (const container of containers) {
      if (!(container instanceof HTMLElement) || !container.isConnected) continue;

      let path = null;
      // 判断容器是否属于活动 leaf（优先使用活动文件路径，确保可靠）
      if (activeLeaf && activeLeaf.view && activeLeaf.view.containerEl.contains(container)) {
        path = activeFile?.path || null;
      } else {
        // 非活动容器尝试获取自身路径
        path = this.getPathForContainer(container);
      }

      // ★ 增强：如果仍然没有路径，但容器是可见的阅读视图，则使用活动文件路径
      if (!path) {
        // 检查容器是否可见（在视口中或部分可见）
        const rect = container.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0 &&
          rect.bottom >= -200 && rect.top <= window.innerHeight + 200;
        if (isVisible) {
          // 如果容器可见，并且是当前活动文件（通常是阅读模式），则使用活动文件路径
          // 但注意：可能有多个可见容器，但只有一个是活动文件，所以这里只能猜测
          // 更安全的做法：如果容器包含 .markdown-preview-view，则使用 activeFile?.path
          if (container.matches('.markdown-preview-view, .markdown-reading-view')) {
            path = activeFile?.path || null;
          }
        }
      }

      if (!path) {
        continue; // 无路径则跳过，不清除高亮（避免误清除）
      }

      this.highlightElement(container, path);
    }
  }

  highlightElement(container, sourcePath = null) {
    if (container.nodeType === Node.ELEMENT_NODE && container.closest && container.closest('.simple-wordbook-tooltip')) return;
    // 若未传入路径，尝试获取
    if (!sourcePath) {
      sourcePath = this.getPathForContainer(container);
    }
    // 如果仍无路径，不清除，直接返回
    if (!sourcePath) {
      return;
    }
    // 范围过滤
    if (!this.shouldHighlightPath(sourcePath)) {
      this.clearHighlights(container);
      return;
    }
    if (this.wordTrie.root.children.size === 0) {
      this.clearHighlights(container);
      return;
    }
    // 清除旧高亮并重新应用
    this.clearHighlights(container);
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.simple-wordbook-highlight') ||
            parent.closest('pre, code, a, .cm-inline-code, .math, .hljs')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const text = node.nodeValue;
      if (!text || !text.trim()) continue;
      const matches = this.wordTrie.findAllMatches(text);
      if (matches.length === 0) continue;
      let lastIdx = 0;
      const frag = document.createDocumentFragment();
      for (const match of matches) {
        if (match.from > lastIdx) frag.appendChild(document.createTextNode(text.substring(lastIdx, match.from)));
        const cards = match.payloads;
        const selectedCard = this.selectCardFromPayloads(cards, sourcePath);
        if (!selectedCard) continue;

        const span = document.createElement('span');
        span.className = this.getHighlightClasses();
        const cardsData = cards.map(c => ({
          word: c.word,
          definition: c.definition,
          sourceFile: c.sourceFile,
          color: c.color,
          phonetic: c.phonetic
        }));
        span.setAttribute('data-cards', JSON.stringify(cardsData));
        span.setAttribute('data-current-source', selectedCard.sourceFile);
        const mainColor = this.getMainColor(selectedCard.color);
        const underlineColor = this.getUnderlineColor(selectedCard.color);
        span.style.setProperty('--word-highlight-color', mainColor);
        span.style.setProperty('--word-underline-color', underlineColor);
        span.textContent = text.substring(match.from, match.to);
        frag.appendChild(span);
        lastIdx = match.to;
      }
      if (lastIdx < text.length) frag.appendChild(document.createTextNode(text.substring(lastIdx)));
      node.parentNode.replaceChild(frag, node);
    }
  }

  // ---------- 编辑模式（CodeMirror） ----------
  registerEditorExtension() {
    if (this.decorationField) return;
    const that = this;

    const decorationField = StateField.define({
      create() { return Decoration.none; },
      update(value, tr) {
        // 如果高亮功能未开启，返回空
        if (!that.plugin.settings.enableHighlight) {
          return Decoration.none;
        }

        // ★★★ 优先获取编辑器自身的文件路径 ★★★
        let path = null;
        // 方法1：通过 editorInfoField 获取当前编辑器对应的文件路径（最准确）
        try {
          const info = tr.state.field(editorInfoField);
          path = info?.file?.path || null;
        } catch (e) { }
        // 方法2：如果获取不到，再使用全局缓存的路径（由 refresh 更新）
        if (!path) {
          path = that._currentEditorPath || null;
        }
        // 方法3：最后尝试获取活动文件路径（回退方案）
        if (!path) {
          path = that.plugin.app.workspace.getActiveFile()?.path || null;
        }

        // 如果仍然没有路径：
        // 若本次事务是刷新效果，则清空装饰（避免残留）；否则保留旧值
        if (!path) {
          if (tr.effects.some(e => e.is(that.REFRESH_EFFECT))) {
            return Decoration.none;
          }
          return value;
        }

        // 检查路径是否允许高亮
        if (!that.shouldHighlightPath(path)) {
          // 若路径不允许，且是刷新效果，则清空
          if (tr.effects.some(e => e.is(that.REFRESH_EFFECT))) {
            return Decoration.none;
          }
          return value;
        }

        // 如果满足重建条件（文档变化、选区变化、收到刷新效果），则重建装饰
        if (tr.docChanged || tr.selection || tr.effects.some(e => e.is(that.REFRESH_EFFECT))) {
          return that.buildDecorations(tr.state, path);
        }

        // 否则保持原有装饰
        return value;
      },
      provide: f => EditorView.decorations.from(f)
    });

    this.decorationField = decorationField;
    this.plugin.registerEditorExtension([decorationField]);
  }

  buildDecorations(state, filePath) {
    const builder = new RangeSetBuilder();
    const doc = state.doc;
    for (let line = 1; line <= doc.lines; line++) {
      const lineText = doc.line(line).text;
      const matches = this.wordTrie.findAllMatches(lineText);
      for (const m of matches) {
        const from = doc.line(line).from + m.from;
        const to = doc.line(line).from + m.to;
        const cards = m.payloads;
        const selectedCard = this.selectCardFromPayloads(cards, filePath);
        if (!selectedCard) continue;
        const mainColor = this.getMainColor(selectedCard.color);
        const underlineColor = this.getUnderlineColor(selectedCard.color);
        const cardsData = cards.map(c => ({
          word: c.word,
          definition: c.definition,
          sourceFile: c.sourceFile,
          color: c.color,
          phonetic: c.phonetic
        }));
        builder.add(from, to, Decoration.mark({
          class: this.getHighlightClasses(),
          attributes: {
            'data-word': selectedCard.word,
            'data-definition': (selectedCard.definition || "").replace(/"/g, '&quot;'),
            'data-source': selectedCard.sourceFile,
            'data-cards': JSON.stringify(cardsData),
            'data-current-source': selectedCard.sourceFile,
            'style': `--word-highlight-color: ${mainColor}; --word-underline-color: ${underlineColor};`
          }
        }));
      }
    }
    return builder.finish();
  }

  registerPostProcessor() {
    // 注册 Markdown 后处理器（阅读模式高亮）
    this.plugin.registerMarkdownPostProcessor((el, ctx) => {
      if (!this.plugin.settings.enableHighlight) return;
      if (el.closest && el.closest('.simple-wordbook-tooltip')) return;
      const sourcePath = ctx.sourcePath;
      if (sourcePath && this.shouldHighlightPath(sourcePath)) {
        this.highlightElement(el, sourcePath);
      } else {
        this.clearHighlights(el);
      }
    });

    // 监听文件打开事件，刷新高亮
    this.plugin.registerEvent(
      this.plugin.app.workspace.on('file-open', () => this.debouncedRefresh())
    );

    // 监听数据更新事件（词库、掌握状态变化），刷新高亮
    this.plugin.registerEvent(
      this.plugin.app.workspace.on('simple-wordbook:data-updated', () => this.debouncedRefresh())
    );

    // ★★★ 监听活动叶子切换事件（包括编辑器焦点切换）★★★
    // 当用户切换编辑器标签或点击不同文档时，触发刷新，确保每个编辑器使用正确的路径进行高亮判断
    this.plugin.registerEvent(
      this.plugin.app.workspace.on('active-leaf-change', () => this.debouncedRefresh())
    );
  }

  // ---------- PDF 高亮 ----------
  isElementVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const buffer = 200;
    return rect.bottom >= -buffer && rect.top <= windowHeight + buffer &&
           rect.right >= -buffer && rect.left <= windowWidth + buffer;
  }

  createAbsoluteHighlightSpan(layer, originalSpan, startOffset, endOffset, selectedCard, allCards) {
    const textNode = Array.from(originalSpan.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (!textNode) return null;
    const text = textNode.textContent || "";
    if (startOffset < 0 || endOffset > text.length) return null;

    const range = document.createRange();
    range.setStart(textNode, startOffset);
    range.setEnd(textNode, endOffset);
    let rects = Array.from(range.getClientRects());
    range.detach();

    if (rects.length === 0) return null;

    // 合并相邻矩形
    const threshold = 2;
    rects.sort((a, b) => a.top - b.top || a.left - b.left);
    const mergedRects = [];
    let current = null;
    for (const rect of rects) {
      if (!current) {
        current = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
        continue;
      }
      const sameRow = (rect.top <= current.bottom + threshold && rect.bottom >= current.top - threshold);
      const xOverlap = (rect.left <= current.right + threshold && rect.right >= current.left - threshold);
      if (sameRow && xOverlap) {
        current.left = Math.min(current.left, rect.left);
        current.top = Math.min(current.top, rect.top);
        current.right = Math.max(current.right, rect.right);
        current.bottom = Math.max(current.bottom, rect.bottom);
      } else {
        mergedRects.push({ ...current });
        current = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
      }
    }
    if (current) mergedRects.push(current);
    if (mergedRects.length === 0) return null;

    // ★ 正确计算实际缩放因子（视口尺寸 / 布局尺寸）
    const layerRect = layer.getBoundingClientRect();
    const scaleX = layerRect.width ? layerRect.width / layer.offsetWidth : 1;
    const scaleY = layerRect.height ? layerRect.height / layer.offsetHeight : 1;

    const mainColor = this.getMainColor(selectedCard.color);
    const fragment = document.createDocumentFragment();
    const cardsData = allCards.map(c => ({
      word: c.word,
      definition: c.definition,
      sourceFile: c.sourceFile,
      color: c.color,
      phonetic: c.phonetic
    }));

    for (const rect of mergedRects) {
      if (rect.right - rect.left <= 0 || rect.bottom - rect.top <= 0) continue;

      const span = document.createElement('span');
      span.className = this.getHighlightClasses() + ' simple-wordbook-pdf-highlight';
      span.setAttribute('data-cards', JSON.stringify(cardsData));
      span.setAttribute('data-current-source', selectedCard.sourceFile);
      span.style.setProperty('--word-highlight-color', mainColor);
      span.style.setProperty('--word-underline-color', this.getUnderlineColor(selectedCard.color));

      // ★ 将视口坐标转换为布局坐标（除以缩放因子）
      const leftPx = (rect.left - layerRect.left) / scaleX + layer.scrollLeft;
      const topPx = (rect.top - layerRect.top) / scaleY + layer.scrollTop + 4; // 微调偏移
      const widthPx = (rect.right - rect.left) / scaleX;
      const heightPx = (rect.bottom - rect.top) / scaleY;

      span.style.position = 'absolute';
      span.style.left = `${leftPx}px`;
      span.style.top = `${topPx}px`;
      span.style.width = `${widthPx}px`;
      span.style.height = `${Math.max(0, heightPx - 6)}px`; // 高度微调
      span.style.boxSizing = 'border-box';
      span.style.padding = '0';
      span.style.margin = '0';
      span.style.lineHeight = '1';
      span.style.pointerEvents = 'auto';
      span.style.cursor = 'pointer';
      span.style.borderRadius = '2px';
      span.style.zIndex = '10';
      
      // ---- 获取实际颜色值（如果 mainColor 是 CSS 变量，解析为具体颜色） ----
      let actualColor = mainColor;
      if (typeof actualColor === 'string' && actualColor.startsWith('var(')) {
        const varName = actualColor.slice(4, -1).trim();
        const computed = getComputedStyle(document.documentElement).getPropertyValue(varName);
        if (computed) actualColor = computed;
      }
      // 设置背景色（不透明）
      span.style.backgroundColor = actualColor;
      // 通过 opacity 控制透明度（0.5 即 50%）
      span.style.opacity = '1';   // 可改为 0.8（80%）或 0（完全透明）

      fragment.appendChild(span);
    }
    return fragment;
  }

  highlightPDFLayer(layer) {
    if (!layer.isConnected) return;

    const container = layer.closest('.pdf-container') || layer.closest('.mod-pdf');
    let path = container ? this.getPathForContainer(container) : null;
    if (!path) {
      const activeFile = this.plugin.app.workspace.getActiveFile();
      if (activeFile && activeFile.extension === 'pdf') {
        path = activeFile.path;
      }
    }
    if (!path || !this.shouldHighlightPath(path)) {
      const oldHighlights = layer.querySelectorAll('.simple-wordbook-pdf-highlight');
      oldHighlights.forEach(el => el.remove());
      return;
    }

    // 快速检查整个层是否在视口内（如果不可见，直接清除并返回）
    if (!this.isElementVisible(layer)) {
      const oldHighlights = layer.querySelectorAll('.simple-wordbook-pdf-highlight');
      oldHighlights.forEach(el => el.remove());
      return;
    }

    // 清除旧高亮
    const oldHighlights = layer.querySelectorAll('.simple-wordbook-pdf-highlight');
    oldHighlights.forEach(el => el.remove());

    // 获取视口尺寸用于过滤 span
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spans = layer.querySelectorAll('span[role="presentation"]');
    for (const span of spans) {
      // ★ 优化：快速跳过不在视口中的 span
      const spanRect = span.getBoundingClientRect();
      if (spanRect.bottom < -50 || spanRect.top > viewportHeight + 50 ||
        spanRect.right < -50 || spanRect.left > viewportWidth + 50) {
        continue;
      }

      const text = span.textContent;
      if (!text || !text.trim()) continue;

      // ★ 优化：使用缓存匹配结果（避免重复 Trie 查找）
      let matches = this._matchCache?.get(span);
      if (matches === undefined) {
        matches = this.wordTrie.findAllMatches(text);
        if (!this._matchCache) this._matchCache = new WeakMap();
        this._matchCache.set(span, matches);
      }

      if (matches.length === 0) continue;

      for (const match of matches) {
        const cards = match.payloads;
        const selectedCard = this.selectCardFromPayloads(cards, path);
        if (!selectedCard) continue;

        const fragment = this.createAbsoluteHighlightSpan(
          layer, span, match.from, match.to, selectedCard, cards
        );
        if (fragment) layer.appendChild(fragment);
      }
    }
  }

  _setupPDFScrollListeners() {
    // 如果已经初始化过 IntersectionObserver，则不再重复
    if (this._intersectionObserver) return;

    // 创建 IntersectionObserver，仅观察进入视口的 textLayer
    this._intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const layer = entry.target;
        if (entry.isIntersecting) {
          // 层进入视口 → 应用高亮
          this.highlightPDFLayer(layer);
        } else {
          // 层离开视口 → 移除高亮以释放内存（可选）
          const highlights = layer.querySelectorAll('.simple-wordbook-pdf-highlight');
          highlights.forEach(el => el.remove());
        }
      }
    }, {
      rootMargin: '150px', // 提前加载临近区域，减少滚动时的等待
      threshold: 0.05      // 只要 5% 可见即触发
    });

    // 观察所有现有的 textLayer
    const textLayers = document.querySelectorAll('.pdf-container .textLayer, .mod-pdf .textLayer');
    for (const layer of textLayers) {
      if (layer.isConnected) {
        this._intersectionObserver.observe(layer);
      }
    }

    // 标记已初始化
    this._pdfContainers.add(document);
  }

  applyToPDFs(retry = 0) {
    if (!this.plugin.settings.enableHighlight) return;

    const textLayers = document.querySelectorAll('.pdf-container .textLayer, .mod-pdf .textLayer');
    if (textLayers.length === 0 && retry < 5) {
      setTimeout(() => this.applyToPDFs(retry + 1), 200);
      return;
    }

    // 断开旧的观察者，防止在应用高亮时触发自身
    if (this._textLayerObserver) {
      this._textLayerObserver.disconnect();
    }

    // 确保 IntersectionObserver 已初始化
    this._setupPDFScrollListeners();

    // 将新的 textLayer 加入观察
    if (this._intersectionObserver) {
      for (const layer of textLayers) {
        if (layer.isConnected && !this._observedLayers?.has(layer)) {
          this._intersectionObserver.observe(layer);
          if (!this._observedLayers) this._observedLayers = new WeakSet();
          this._observedLayers.add(layer);
        }
      }
    }

    // ★ 对于已经在视口中的层，立即高亮（避免等待滚动）
    for (const layer of textLayers) {
      if (layer.isConnected && this.isElementVisible(layer)) {
        this.highlightPDFLayer(layer);
      }
    }

    // 重新建立 MutationObserver，监听新的 textLayer 加入
    if (textLayers.length > 0) {
      if (!this._textLayerObserver) {
        this._textLayerObserver = new MutationObserver(() => {
          this.debouncedRefresh();
        });
      }
      const config = { childList: true, subtree: true, characterData: true };
      for (const layer of textLayers) {
        if (layer.isConnected) {
          this._textLayerObserver.observe(layer, config);
        }
      }
    }
  }

  observePDFLayers() {
    if (this.pdfObserver) return this.pdfObserver;

    const observer = new MutationObserver((mutations) => {
      let needRefresh = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList && (node.classList.contains('textLayer') || node.querySelector('.textLayer'))) {
                needRefresh = true;
                break;
              }
            }
          }
        }
      }
      if (needRefresh) {
        setTimeout(() => {
          this.applyToPDFs(0);
          this._setupPDFScrollListeners();
        }, 100);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    this.pdfObserver = observer;

    setTimeout(() => this._setupPDFScrollListeners(), 200);
    return observer;
  }

  cleanupPDFListeners() {
    // 清理滚动监听
    for (const container of this._pdfContainers) {
      if (container._swbScrollHandler) {
        container.removeEventListener('scroll', container._swbScrollHandler);
        delete container._swbScrollHandler;
      }
    }
    this._pdfContainers.clear();

    if (this._pdfRefreshTimer) {
      cancelAnimationFrame(this._pdfRefreshTimer);
      this._pdfRefreshTimer = null;
    }

    // 清理文本层观察者
    if (this._textLayerObserver) {
      this._textLayerObserver.disconnect();
      this._textLayerObserver = null;
    }

    // ★ 清理 IntersectionObserver
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      this._intersectionObserver = null;
    }

    // 清理全局滚动监听
    if (this._globalScrollHandler) {
      document.removeEventListener('scroll', this._globalScrollHandler, { capture: true });
      this._globalScrollHandler = null;
    }

    // 清空匹配缓存
    if (this._matchCache) {
      this._matchCache = new WeakMap();
    }
    this._observedLayers = new WeakSet();
  }
}

// ========== 悬停预览 ==========
class HoverPreview {
  constructor(plugin) {
    this.plugin = plugin;
    this.activeTooltip = null;
    this.hoverTimeout = null;
    this.closeTimeout = null;
    this.currentTarget = null;
    this.lastShowTime = 0;
    this._isMouseOnTooltip = false;
    this._fixedTop = null;    // 存储弹窗固定的 top 值
    this.registerEvents();
  }

  registerEvents() {
    this.plugin.registerDomEvent(document, "mouseover", this.onMouseOver.bind(this), true);
    this.plugin.registerDomEvent(document, "mouseout", this.onMouseOut.bind(this), true);
  }

  /**
 * 根据当前固定的 top 值，动态设置弹窗最大高度
 */
  _applyMaxHeight(tooltip) {
    if (this._fixedTop === null) return;
    const cssMax = 400; // 与 CSS 中的 max-height 保持一致
    const remaining = window.innerHeight + window.scrollY - this._fixedTop - 10; // 10px 底部边距
    const dynamicMax = Math.min(cssMax, Math.max(200, remaining)); // 至少 200px
    tooltip.style.maxHeight = dynamicMax + 'px';
  }

  /**
   * 重新定位弹窗（仅修正水平位置，并刷新最大高度）
   */
  repositionTooltip() {
    if (!this.activeTooltip || !this.currentTarget || this._fixedTop === null) return;
    const tooltip = this.activeTooltip;
    const rect = this.currentTarget.getBoundingClientRect();

    // ---- 仅重新计算 left（水平边界检测） ----
    let left = rect.left + window.scrollX;
    const tooltipWidth = tooltip.offsetWidth;
    const maxRight = window.innerWidth + window.scrollX - 10;
    if (left + tooltipWidth > maxRight) left = maxRight - tooltipWidth;
    if (left < window.scrollX + 10) left = window.scrollX + 10;
    tooltip.style.left = left + 'px';

    // ---- 重新计算最大高度（视口可能变化） ----
    this._applyMaxHeight(tooltip);
  }

  onMouseOver(e) {
    if (!this.plugin.settings.enableHoverPreview) return;
    if (this.activeTooltip && this.activeTooltip.contains(e.target)) return;
    const target = e.target.closest('.simple-wordbook-highlight, .simple-wordbook-pdf-highlight');
    if (!target) return;
    if (this.currentTarget === target && this.activeTooltip) {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
      return;
    }
    let word = target.getAttribute('data-word');
    if (!word) {
      const cardsData = target.getAttribute('data-cards');
      if (cardsData) {
        try {
          const cards = JSON.parse(cardsData);
          if (cards.length > 0) word = cards[0].word;
        } catch(e) {}
      }
    }
    if (!word) return;
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    this.currentTarget = target;
    this.hoverTimeout = setTimeout(() => {
      this.hoverTimeout = null;
      const now = Date.now();
      if (now - this.lastShowTime < 150) return;
      this.lastShowTime = now;
      if (this.activeTooltip) {
        this.removeTooltip();
      }
      this.showTooltip(target, word);
    }, 120);
  }

  onMouseOut(e) {
    if (!this.plugin.settings.enableHoverPreview) return;
    const toElement = e.relatedTarget;

    // 如果鼠标移到了弹窗内的元素，取消所有关闭定时器
    if (this.activeTooltip && this.activeTooltip.contains(toElement)) {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
      return;
    }

    // 如果移到了另一个高亮元素，不关闭（允许切换）
    if (toElement && toElement.closest && toElement.closest('.simple-wordbook-highlight, .simple-wordbook-pdf-highlight')) {
      return;
    }

    // 清除悬停定时器
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }

    // 如果弹窗存在，延迟检查后再决定是否关闭
    if (this.activeTooltip) {
      // 先清除旧定时器
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }

      // 设置一个短延迟，给鼠标进入弹窗留出时间
      this.closeTimeout = setTimeout(() => {
        // 延迟后再次检查鼠标是否在弹窗内
        if (this._isMouseOnTooltip || (this.activeTooltip && this.activeTooltip.contains(document.activeElement))) {
          // 鼠标已在弹窗内，取消关闭
          if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
            this.closeTimeout = null;
          }
          return;
        }
        // 否则关闭弹窗
        if (this.activeTooltip) {
          this.removeTooltip();
        }
        this.closeTimeout = null;
      }, 150); // 150ms 的延迟，可根据实际调整（100~200ms）
    }
  }

  removeTooltip() {
    if (this.activeTooltip) {
      this.activeTooltip.remove();
      this.activeTooltip = null;
      this.currentTarget = null;
      this._isMouseOnTooltip = false;
      this._fixedTop = null;
    }
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    this.removeCustomTooltip();
  }

  showCustomTooltip(btn, text) {
    this.removeCustomTooltip();
    const tooltip = document.createElement("div");
    tooltip.className = "swb-custom-tooltip";
    tooltip.textContent = text;
    tooltip.style.position = "fixed";
    tooltip.style.backgroundColor = "var(--background-primary)";
    tooltip.style.color = "var(--text-normal)";
    tooltip.style.border = "1px solid var(--background-modifier-border)";
    tooltip.style.borderRadius = "4px";
    tooltip.style.padding = "4px 8px";
    tooltip.style.fontSize = "12px";
    tooltip.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    tooltip.style.zIndex = "9999";
    tooltip.style.pointerEvents = "none";
    tooltip.style.whiteSpace = "nowrap";
    document.body.appendChild(tooltip);

    const rect = btn.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
    let top = rect.top - tooltip.offsetHeight - 6;
    if (top < 10) { top = rect.bottom + 6; }
    if (left < 10) { left = 10; }
    if (left + tooltip.offsetWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltip.offsetWidth - 10;
    }
    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
    this._customTooltip = tooltip;
  }

  removeCustomTooltip() {
    if (this._customTooltip) {
      this._customTooltip.remove();
      this._customTooltip = null;
    }
  }

  async showTooltip(target, word) {
    // ★ 清除可能残留的关闭定时器
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    if (this.activeTooltip) this.removeTooltip();

    let allCards = [];
    const cardsAttr = target.getAttribute('data-cards');
    if (cardsAttr) {
      try {
        allCards = JSON.parse(cardsAttr);
      } catch (e) { }
    }
    if (allCards.length === 0) {
      const allCardsFromStore = this.plugin.getAllCards();
      allCards = allCardsFromStore.filter(card => card.word.toLowerCase() === word.toLowerCase());
    }
    if (allCards.length === 0) {
      new Notice(t("notice_word_not_found", word));
      return;
    }

    const wordKey = word.toLowerCase();
    const preferredSource = this.plugin.settings.selectedSourceMap?.[wordKey];
    let currentCard = allCards.find(c => c.sourceFile === preferredSource) || allCards[0];

    let sections = currentCard?.sections;
    if (!sections || sections.length === 0) {
      sections = parseSections(currentCard?.definition || "");
    }
    if (sections.length === 0) {
      sections = [{ title: "释义", content: currentCard?.definition || "" }];
    }

    const tooltip = document.createElement("div");
    tooltip.className = "simple-wordbook-tooltip";
    if (this.plugin.settings.enableBlurDefinition) {
      tooltip.classList.add("blur-definition");
    }

    const titleDiv = tooltip.createDiv({ cls: "tooltip-title" });
    const wordSpan = titleDiv.createSpan({ cls: "word", text: word });
    wordSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      playPronunciation(word, this.plugin.settings.ttsUrlTemplate, this.plugin.settings.pronunciationVariant);
    });

    const buttonGroup = titleDiv.createDiv({ cls: "tooltip-title-buttons" });
    buttonGroup.style.display = "flex";
    buttonGroup.style.gap = "6px";
    buttonGroup.style.alignItems = "center";

    const currentSource = currentCard.sourceFile;
    const studyKey = getStudyKey(word, currentSource);
    const isMastered = this.plugin.masteryStore.isMastered(studyKey);

    const masteryBtn = buttonGroup.createDiv({ cls: "clickable-icon tooltip-mastery-btn" });
    setIcon(masteryBtn, isMastered ? "meh" : "smile");
    masteryBtn.classList.add(isMastered ? "icon-meh" : "icon-smile");
    masteryBtn.style.cursor = "pointer";
    masteryBtn.style.opacity = "0.7";
    const masteryLabel = isMastered ? t("notice_mastery_label_on") : t("notice_mastery_label_off");
    masteryBtn.addEventListener("mouseenter", () => this.showCustomTooltip(masteryBtn, masteryLabel));
    masteryBtn.addEventListener("mouseleave", () => this.removeCustomTooltip());
    masteryBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      this.removeCustomTooltip();
      const newState = !isMastered;
      const currentStudyKey = getStudyKey(word, currentSource);
      await this.plugin.masteryStore.setMastered(currentStudyKey, newState);
      await this.plugin.highlighter.refresh();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
      setIcon(masteryBtn, newState ? "smile" : "meh");
      new Notice(newState ? t("notice_mastery_marked", word) : t("notice_mastery_unmarked", word));
      this.removeTooltip();
    });

    const locateBtn = buttonGroup.createDiv({ cls: "clickable-icon tooltip-locate-btn" });
    setIcon(locateBtn, "crosshair");
    locateBtn.style.cursor = "pointer";
    locateBtn.style.opacity = "0.7";
    const locateLabel = t("notice_locate_label");
    locateBtn.addEventListener("mouseenter", () => this.showCustomTooltip(locateBtn, locateLabel));
    locateBtn.addEventListener("mouseleave", () => this.removeCustomTooltip());
    locateBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      this.removeCustomTooltip();
      const currentCardObj = allCards.find(c => c.sourceFile === currentSource) || allCards[0];
      if (!currentCardObj) {
        new Notice(t("notice_card_data_not_found"));
        return;
      }
      await this.plugin.focusWordInSidebar(currentCardObj, currentSource);
      this.removeTooltip();
    });

    const hasMultipleSections = sections.length > 1;
    let tabBar = null;
    if (hasMultipleSections) {
      tabBar = tooltip.createDiv({ cls: "tooltip-tab-bar" });
      tabBar.style.display = "flex";
      tabBar.style.gap = "8px";
      tabBar.style.marginBottom = "6px";
      tabBar.style.borderBottom = "1px solid var(--background-modifier-border)";
      tabBar.style.paddingBottom = "4px";
    }

    const contentDiv = tooltip.createDiv({ cls: "tooltip-content" });
    let activeSectionIndex = 0;

    const renderContent = async (index) => {
      contentDiv.empty();
      const section = sections[index];
      if (section) {
        let content = section.content;
        if (section.title === "释义" && currentCard?.phonetic) {
          const phoneticHtml = `<span class="tooltip-phonetic">${currentCard.phonetic}</span>`;
          content = `${phoneticHtml}\n\n${content}`;
        }
        const processed = processLineBreaks(content);
        // ★ 等待渲染完成
        await MarkdownRenderer.render(this.plugin.app, processed, contentDiv, currentCard.sourceFile, this.plugin);
        // ★ 修复内部链接
        fixInternalLinks(contentDiv, this.plugin.app, currentCard.sourceFile);
        this.repositionTooltip();
      } else {
        contentDiv.setText(t("no_definition"));
        this.repositionTooltip();
      }
    };

    if (hasMultipleSections && tabBar) {
      sections.forEach((section, idx) => {
        const tab = tabBar.createDiv({ cls: "tooltip-tab" });
        tab.textContent = section.title;
        tab.style.cursor = "pointer";
        tab.style.padding = "2px 8px";
        tab.style.borderRadius = "4px";
        tab.style.fontSize = "0.85em";
        tab.style.color = idx === 0 ? "var(--text-accent)" : "var(--text-muted)";
        if (idx === 0) tab.style.fontWeight = "bold";
        tab.addEventListener("click", async () => {
          tabBar.querySelectorAll(".tooltip-tab").forEach(t => {
            t.style.color = "var(--text-muted)";
            t.style.fontWeight = "normal";
          });
          tab.style.color = "var(--text-accent)";
          tab.style.fontWeight = "bold";
          activeSectionIndex = idx;
          await renderContent(idx);
        });
      });
      await renderContent(0);
    } else {
      await renderContent(0);
    }

    const footerDiv = tooltip.createDiv({ cls: "tooltip-footer" });
    footerDiv.style.display = "flex";
    footerDiv.style.alignItems = "center";
    footerDiv.style.justifyContent = "flex-end";
    footerDiv.style.gap = "4px";

    const fromLabel = footerDiv.createSpan({ cls: "tooltip-from-label", text: "from" });
    fromLabel.style.color = "var(--text-muted)";
    fromLabel.style.fontSize = "0.75em";

    if (allCards.length > 1) {
      tooltip.classList.add('has-source-select');
      const select = footerDiv.createEl("select", { cls: "tooltip-source-select" });
      for (const card of allCards) {
        const option = select.createEl("option", {
          value: card.sourceFile,
          text: card.sourceFile.split('/').pop()
        });
        if (card.sourceFile === currentCard.sourceFile) option.selected = true;
      }

      select.addEventListener("change", async (e) => {
        e.stopPropagation();
        this.removeCustomTooltip();

        const newSource = e.target.value;
        const newCard = allCards.find(c => c.sourceFile === newSource);
        if (!newCard) return;

        if (!this.plugin.settings.selectedSourceMap) {
          this.plugin.settings.selectedSourceMap = {};
        }
        this.plugin.settings.selectedSourceMap[wordKey] = newSource;
        await this.plugin.saveSettings();

        await this.plugin.highlighter.refresh();

        this.removeTooltip();
        this.showTooltip(target, word);
      });

      footerDiv.appendChild(select);
    } else {
      const sourceSpan = footerDiv.createSpan({ cls: "tooltip-source", text: allCards[0]?.sourceFile?.split('/').pop() || '' });
      footerDiv.appendChild(sourceSpan);
    }

    document.body.appendChild(tooltip);
    const rect = target.getBoundingClientRect();
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 5;

    const tooltipRect = tooltip.getBoundingClientRect();
    const maxRight = window.innerWidth + window.scrollX - 10;
    if (left + tooltipRect.width > maxRight) left = maxRight - tooltipRect.width;
    if (left < window.scrollX + 10) left = window.scrollX + 10;
    if (top + tooltipRect.height > window.innerHeight + window.scrollY - 10) {
      top = rect.top + window.scrollY - tooltipRect.height - 5;
    }
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    // ★ 记录固定 top，并应用最大高度
    this._fixedTop = top;
    this._applyMaxHeight(tooltip);

    tooltip.addEventListener("mouseenter", () => {
      this._isMouseOnTooltip = true;
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
    });
    tooltip.addEventListener("mouseleave", () => {
      this._isMouseOnTooltip = false;
      this.closeTimeout = setTimeout(() => {
        if (this.activeTooltip === tooltip) this.removeTooltip();
        this.closeTimeout = null;
      }, 10);
    });

    this.activeTooltip = tooltip;
    this.currentTarget = target;
  }

  destroy() {
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
    this.removeTooltip();
    this.removeCustomTooltip();
  }
}

// ========== 侧边栏视图 ==========
class SidebarView extends ItemView {
  // ★ 新增：用于分批渲染的定时器句柄
  _renderTimer = null;
  _refreshTimer = null;

  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.currentFileWords = [];
    this.filteredWords = [];
    this.searchQuery = "";
    this.activeTab = "learning";
    this.cardCache = new Map();
  }
  getViewType() { return VIEW_TYPE_SIDEBAR; }
  getDisplayText() { return t("sidebar_title"); }
  getIcon() { return "book"; }
  async onOpen() {
    this.containerEl.empty();
    this.containerEl.addClass("simple-wordbook-sidebar");
    this.registerEvent(this.plugin.app.workspace.on("file-open", () => this.refresh()));
    this.registerEvent(this.plugin.app.workspace.on("simple-wordbook:data-updated", () => this.refresh()));
    // ★ 新增：监听高亮刷新事件，仅 PDF 时刷新
    this.registerEvent(this.plugin.app.workspace.on("simple-wordbook:highlighter-updated", () => {
      const activeFile = this.plugin.app.workspace.getActiveFile();
      if (activeFile && activeFile.extension === "pdf") {
        this.debouncedRefresh();
      }
    }));
    await this.refresh();
  }

  onClose() {
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
    }
  }

  debouncedRefresh() {
    if (this._refreshTimer) clearTimeout(this._refreshTimer);
    this._refreshTimer = setTimeout(() => {
      this.refresh();
      this._refreshTimer = null;
    }, 200);
  }

  async refresh() {
    await this.scanCurrentDocument();
    this.filterWords();
    this.render();
  }

  async scanCurrentDocument() {
    const activeFile = this.plugin.app.workspace.getActiveFile();
    if (!activeFile) {
      this.currentFileWords = [];
      return;
    }
    const filterEnabled = this.plugin.settings.enableSidebarScopeFilter;
    if (filterEnabled) {
      const inScope = this.plugin.isPathInScope(activeFile.path);
      if (!inScope) {
        this.currentFileWords = [];
        return;
      }
    }

    let content = "";
    if (activeFile.extension === "pdf") {
      content = await this.extractPDFTextFromDOM();
    } else {
      content = await this.plugin.app.vault.read(activeFile);
    }
    if (!content) {
      this.currentFileWords = [];
      return;
    }

    const lowerContent = content.toLowerCase();
    const sidebarTrie = this.plugin.sidebarTrie;
    if (!sidebarTrie || sidebarTrie.root.children.size === 0) {
      this.currentFileWords = [];
      return;
    }

    const matches = sidebarTrie.findAllMatches(lowerContent);
    if (matches.length === 0) {
      this.currentFileWords = [];
      return;
    }

    const mastery = this.plugin.masteryStore;
    const seenKeys = new Set();  // 用于去重显示（每个词源单独显示）
    const matchedCards = [];

    for (const match of matches) {
      for (const card of match.payloads) {
        if (!card) continue;
        const normalizedWord = normalizeWord(card.word);
        // displayKey 始终包含词源路径，确保不同词源的卡片都显示
        const displayKey = `${card.sourceFile}::${normalizedWord}`;
        if (seenKeys.has(displayKey)) continue;
        seenKeys.add(displayKey);

        // stateKey 根据模式决定：全局模式用单词本身，否则用 displayKey
        let stateKey;
        if (this.plugin.settings.masteryMode === "global") {
          stateKey = normalizedWord;
        } else {
          stateKey = displayKey;
        }

        const mastered = mastery.isMastered(stateKey);
        const ignored = mastery.isIgnored(stateKey);
        matchedCards.push({
          ...card,
          mastered,
          ignored,
          studyKey: displayKey,      // 用于显示缓存（唯一）
          _stateKey: stateKey        // 用于状态操作
        });
      }
    }

    this.currentFileWords = matchedCards;
  }

  // ★ 优化1：PDF提取改用轮询，去掉固定500ms延迟
  async extractPDFTextFromDOM() {
    const maxWait = 500;
    const start = Date.now();
    let textLayers = null;

    while (Date.now() - start < maxWait) {
      textLayers = document.querySelectorAll('.pdf-container .textLayer, .mod-pdf .textLayer');
      let hasContent = false;
      for (const layer of textLayers) {
        if (layer.querySelector('span[role="presentation"]')) {
          hasContent = true;
          break;
        }
      }
      if (hasContent) break;
      await new Promise(r => setTimeout(r, 50));
    }

    if (!textLayers) textLayers = document.querySelectorAll('.pdf-container .textLayer, .mod-pdf .textLayer');
    let text = "";
    for (const layer of textLayers) {
      const spans = layer.querySelectorAll('span[role="presentation"]');
      for (const span of spans) {
        const spanText = span.textContent || "";
        if (spanText.trim()) text += spanText + " ";
      }
      text += "\n";
    }
    return text.trim();
  }

  render() {
    const container = this.containerEl;
    container.empty();
    this.cardCache.clear();
    // 清除旧的渲染定时器，防止冲突
    if (this._renderTimer) {
      clearTimeout(this._renderTimer);
      this._renderTimer = null;
    }

    const searchDiv = container.createDiv({ cls: "sidebar-search" });
    const searchInput = searchDiv.createEl("input", { type: "text", placeholder: t("search_placeholder") });
    searchInput.value = this.searchQuery;
    searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.filterWords();
      this.updateCardVisibility();
      // ★ 搜索后渲染新匹配的卡片
      this._scheduleBatchRendering(this.filteredWords);
    });

    const tabBar = container.createDiv({ cls: "sidebar-tabs" });
    const updateTabCounts = () => {
      const learningCount = this.currentFileWords.filter(w => !w.mastered && !w.ignored).length;
      const masteredCount = this.currentFileWords.filter(w => w.mastered).length;
      const ignoredCount = this.currentFileWords.filter(w => w.ignored).length;
      const tabs = [
        { id: "learning", label: `${t("tab_learning")} (${learningCount})` },
        { id: "mastered", label: `${t("tab_mastered")} (${masteredCount})` },
        { id: "ignored", label: `${t("tab_ignored")} (${ignoredCount})` }
      ];
      tabBar.empty();
      for (const tab of tabs) {
        const tabEl = tabBar.createDiv({ cls: `sidebar-tab ${this.activeTab === tab.id ? "active" : ""}`, text: tab.label });
        tabEl.addEventListener("click", () => this.switchTab(tab.id));
      }
    };
    updateTabCounts();

    this.listContainer = container.createDiv({ cls: "word-list" });

    // ★ 优化2：第一轮只建DOM骨架，不渲染Markdown
    for (const word of this.currentFileWords) {
      const card = this.createWordCard(word, this.listContainer);
      this.cardCache.set(word.studyKey, card);
    }
    this.updateCardVisibility();
    this.updateTabCounts = updateTabCounts;

    // ★ 优化3：第二轮分批异步渲染释义（首批10个立即显示）
    this._scheduleBatchRendering(this.filteredWords);
  }

  switchTab(tabId) {
    if (this.activeTab === tabId) return;
    this.activeTab = tabId;
    this.filterWords();
    this.updateCardVisibility();
    if (this.updateTabCounts) this.updateTabCounts();
    // ★ 触发新标签页中卡片的渲染
    this._scheduleBatchRendering(this.filteredWords);
  }

  filterWords() {
    let base = this.currentFileWords;
    if (this.activeTab === "learning") base = base.filter(w => !w.mastered && !w.ignored);
    else if (this.activeTab === "mastered") base = base.filter(w => w.mastered);
    else base = base.filter(w => w.ignored);
    if (this.searchQuery) {
      base = base.filter(w => w.word.toLowerCase().includes(this.searchQuery) || (w.aliases && w.aliases.some(a => a.toLowerCase().includes(this.searchQuery))));
    }
    this.filteredWords = base;
  }

  updateCardVisibility() {
    for (const card of this.cardCache.values()) card.style.display = "none";
    for (const word of this.filteredWords) {
      const card = this.cardCache.get(word.studyKey);
      if (card) card.style.display = "";
    }
  }

  // ★ 优化4：createWordCard只建骨架，挂载元数据
  createWordCard(wordObj, container) {
    const cardDiv = container.createDiv({ cls: "word-card" });
    const colorMap = { red: "var(--color-red)", orange: "var(--color-orange)", yellow: "var(--color-yellow)", green: "var(--color-green)", blue: "var(--color-blue)", purple: "var(--color-purple)" };
    cardDiv.style.setProperty("--card-color", colorMap[wordObj.color] || "var(--interactive-accent)");

    const actionsDiv = cardDiv.createDiv({ cls: "card-actions" });
    if (this.plugin.settings.enableMastery) {
      const masteryBtn = actionsDiv.createDiv({ cls: "action-icon" });
      setIcon(masteryBtn, wordObj.mastered ? "meh" : "smile");
      masteryBtn.classList.add(wordObj.mastered ? "icon-meh" : "icon-smile");
      masteryBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const newState = !wordObj.mastered;
        await this.plugin.masteryStore.setMastered(wordObj._stateKey, newState);
        await this.plugin.highlighter.refresh();
        this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
        await this.refresh();
      });
    }
    const ignoreBtn = actionsDiv.createDiv({ cls: "action-icon" });
    setIcon(ignoreBtn, wordObj.ignored ? "eye-off" : "eye");
    ignoreBtn.classList.add(wordObj.ignored ? "icon-eye-off" : "icon-eye");
    ignoreBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const newIgnore = !wordObj.ignored;
      await this.plugin.masteryStore.setIgnored(wordObj._stateKey, newIgnore);
      await this.plugin.highlighter.refresh();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
      await this.refresh();
    });

    const wordLine = cardDiv.createDiv({ cls: "word-line" });
    const wordSpan = wordLine.createSpan({ cls: "word", text: wordObj.word });
    wordSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      playPronunciation(wordObj.word, this.plugin.settings.ttsUrlTemplate, this.plugin.settings.pronunciationVariant);
    });

    const defDiv = cardDiv.createDiv({ cls: "definition" });
    if (this.plugin.settings.enableBlurDefinition) defDiv.classList.add("blur");

    const sections = wordObj.sections || [{ title: "释义", content: wordObj.definition || "" }];
    const hasMultipleSections = sections.length > 1;
    let tabBar = null;
    if (hasMultipleSections) {
      tabBar = defDiv.createDiv({ cls: "word-card-tab-bar" });
      tabBar.style.display = "flex";
      tabBar.style.gap = "6px";
      tabBar.style.marginBottom = "4px";
      tabBar.style.flexWrap = "wrap";
    }

    // 内容容器先占位
    const contentContainer = defDiv.createDiv({ cls: "word-card-content" });
    contentContainer.setText(t("notice_loading_definition"));

    // ★ 挂载元数据供后续 _renderCardContent 使用
    cardDiv._wordData = wordObj;
    cardDiv._sections = sections;
    cardDiv._tabBar = tabBar;
    cardDiv._contentContainer = contentContainer;
    cardDiv._defDiv = defDiv;
    cardDiv._hasMultipleSections = hasMultipleSections;

    if (this.plugin.settings.enableBlurDefinition) {
      defDiv.addEventListener("mouseenter", () => defDiv.classList.remove("blur"));
      defDiv.addEventListener("mouseleave", () => defDiv.classList.add("blur"));
    }

    const sourceDiv = cardDiv.createDiv({ cls: "source", text: wordObj.sourceFile.split('/').pop() });
    cardDiv.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      new WordContextMenu(this.plugin, wordObj).showAtMouseEvent(e);
    });
    return cardDiv;
  }

  // ★ 新增：分批渲染调度器（每批10个）
  _scheduleBatchRendering(words) {
    if (this._renderTimer) {
      clearTimeout(this._renderTimer);
      this._renderTimer = null;
    }
    const BATCH_SIZE = 10;
    let index = 0;

    const renderNextBatch = () => {
      const batch = words.slice(index, index + BATCH_SIZE);
      if (batch.length === 0) {
        this._renderTimer = null;
        return;
      }

      for (const word of batch) {
        const card = this.cardCache.get(word.studyKey);
        if (card) {
          this._renderCardContent(card);
        }
      }

      index += BATCH_SIZE;
      this._renderTimer = setTimeout(renderNextBatch, 0);
    };

    renderNextBatch();
  }

  // ★ 新增：实际渲染单个卡片的释义和标签
  async _renderCardContent(card) {
    // ★ 防止重复渲染，如果已经渲染过则跳过
    if (card._rendered) return;
    card._rendered = true;

    const wordObj = card._wordData;
    const sections = card._sections;
    const contentContainer = card._contentContainer;
    const tabBar = card._tabBar;
    const hasMultipleSections = card._hasMultipleSections;
    const defDiv = card._defDiv;

    const renderContent = async (index) => {
      contentContainer.empty();
      const section = sections[index];
      if (section) {
        let content = section.content;
        if (section.title === "释义" && wordObj.phonetic) {
          const phoneticHtml = `<span class="card-phonetic">${wordObj.phonetic}</span>`;
          content = `${phoneticHtml}\n\n${content}`;
        }
        const processed = processLineBreaks(content);
        // ★ 等待渲染完成
        await MarkdownRenderer.render(this.plugin.app, processed, contentContainer, wordObj.sourceFile, this.plugin);
        // ★ 修复内部链接
        fixInternalLinks(contentContainer, this.plugin.app, wordObj.sourceFile);
      } else {
        contentContainer.setText(t("no_definition"));
      }
    };

    if (tabBar) {
      tabBar.empty();
      sections.forEach((section, idx) => {
        const tab = tabBar.createDiv({ cls: "word-card-tab" });
        tab.textContent = section.title;
        tab.style.cursor = "pointer";
        tab.style.padding = "2px 6px";
        tab.style.borderRadius = "3px";
        tab.style.fontSize = "0.8em";
        tab.style.color = idx === 0 ? "var(--text-accent)" : "var(--text-muted)";
        if (idx === 0) tab.style.fontWeight = "bold";
        tab.addEventListener("click", async (e) => {
          e.stopPropagation();
          tabBar.querySelectorAll(".word-card-tab").forEach(t => {
            t.style.color = "var(--text-muted)";
            t.style.fontWeight = "normal";
          });
          tab.style.color = "var(--text-accent)";
          tab.style.fontWeight = "bold";
          await renderContent(idx);
        });
      });
    }
    // 首次渲染第一个标签
    await renderContent(0);
  }

  async focusWord(wordObj, preferredSource = null) {
    // 1. 优先使用缓存数据，避免不必要的刷新
    let targetCard = this.currentFileWords.find(w =>
      w.word.toLowerCase() === wordObj.word.toLowerCase() &&
      (preferredSource ? w.sourceFile === preferredSource : true)
    );
    if (!targetCard) {
      await this.refresh();
      targetCard = this.currentFileWords.find(w =>
        w.word.toLowerCase() === wordObj.word.toLowerCase() &&
        (preferredSource ? w.sourceFile === preferredSource : true)
      );
    }
    if (!targetCard) {
      new Notice(t("notice_word_not_found", wordObj.word));
      return;
    }

    // 2. 切换到正确的标签页
    if (targetCard.mastered) {
      this.activeTab = "mastered";
    } else if (targetCard.ignored) {
      this.activeTab = "ignored";
    } else {
      this.activeTab = "learning";
    }

    // 3. 更新可见性（不重建 DOM）
    this.filterWords();
    this.updateCardVisibility();
    if (this.updateTabCounts) this.updateTabCounts();

    // 4. 等待两个动画帧，确保 DOM 完全重排
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));

    // 5. 获取卡片元素，强制回流确保高度已计算
    const cardKey = targetCard.studyKey;
    const cardElement = this.cardCache.get(cardKey);
    if (!cardElement) {
      new Notice(t("notice_card_data_not_found"));
      return;
    }
    // 强制触发浏览器回流
    cardElement.offsetHeight;

    // 6. 使用 scrollIntoView 居中滚动
    cardElement.scrollIntoView({ block: "center", behavior: "smooth" });

    // 7. 高亮提示
    cardElement.style.transition = "background-color 0.3s";
    cardElement.style.backgroundColor = "var(--interactive-accent)";
    setTimeout(() => {
      cardElement.style.backgroundColor = "";
    }, 1500);
  }
}

// ========== 查词面板视图 ==========
class LookupView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.currentWord = "";
    this.currentPromptName = "";
    this.resultMarkdown = "";
    this.isLoading = false;
  }

  getViewType() { return VIEW_TYPE_LOOKUP; }
  getDisplayText() { return t("lookup_view_title"); }
  getIcon() { return "search-code"; }

  async onOpen() {
    this.containerEl.empty();
    this.containerEl.addClass("simple-wordbook-lookup-panel");
    this.buildUI();
    this.refreshPromptSelect();
    // 如果有待查询的单词，自动查询
    if (this.currentWord) {
      this.searchInput.value = this.currentWord;
      const mode = this.plugin.settings.enterMode || "local_first";
      if (mode === "local_only") {
        await this.doLocalLookup(this.currentWord);
      } else if (mode === "ai_only") {
        await this.doAILookup(this.currentWord);
      } else { // local_first
        await this.doLocalLookup(this.currentWord);
        if (this.localNotFound) {
          this._showFallbackHint = true;
          await this.doAILookup(this.currentWord);
        }
      }
    }
  }

  buildUI() {
    const container = this.containerEl;

    // 输入行（输入框 + 清空按钮）
    const inputRow = container.createDiv({ cls: "lookup-input-row" });
    const searchInput = inputRow.createEl("input", { type: "text", placeholder: t("lookup_input_placeholder") });
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const mode = this.plugin.settings.enterMode || "local_first";
        const word = searchInput.value;
        if (mode === "local_only") {
          this.doLocalLookup(word);
        } else if (mode === "ai_only") {
          this.doAILookup(word);
        } else {
          this.doLocalLookup(word);
          if (this.localNotFound) {
            this._showFallbackHint = true;
            this.doAILookup(word);
          }
        }
      }
    });
    this.searchInput = searchInput;

    // 清空输入框按钮
    const clearInputBtn = inputRow.createEl("button", { cls: "lookup-clear-input-btn" });
    setIcon(clearInputBtn, "x");
    clearInputBtn.setAttribute("aria-label", t("lookup_clear_input"));
    clearInputBtn.addEventListener("click", () => {
      this.searchInput.value = "";
      this.searchInput.focus();
    });
    this.clearInputBtn = clearInputBtn;

    // 按钮行
    const buttonRow = container.createDiv({ cls: "lookup-button-row" });
    const localBtn = buttonRow.createEl("button", { text: t("lookup_local_button"), cls: "mod-cta" });
    localBtn.addEventListener("click", () => this.doLocalLookup(searchInput.value));
    const aiBtn = buttonRow.createEl("button", { text: t("lookup_ai_button"), cls: "mod-cta" });
    aiBtn.addEventListener("click", () => this.doAILookup(searchInput.value));
    this.localBtn = localBtn;
    this.aiBtn = aiBtn;

    // 提示词选择行
    const promptRow = container.createDiv({ cls: "lookup-prompt-row" });
    const promptLabel = promptRow.createSpan({ text: t("lookup_prompt_label") });
    const promptSelect = promptRow.createEl("select");
    promptSelect.addEventListener("change", () => {
      const selected = promptSelect.value;
      this.plugin.settings.selectedPrompt = selected;
      this.plugin.saveSettings();
    });
    this.promptSelect = promptSelect;

    // 结果区域
    const resultContainer = container.createDiv({ cls: "lookup-result" });
    this.resultContainer = resultContainer;

    // 底部操作栏（清空输出 + 保存单词）
    const bottomBar = container.createDiv({ cls: "lookup-bottom-bar" });

    // 清空输出框按钮
    const clearOutputBtn = bottomBar.createEl("button", { cls: "lookup-clear-output-btn" });
    setIcon(clearOutputBtn, "eraser");
    clearOutputBtn.setAttribute("aria-label", t("lookup_clear_output"));
    clearOutputBtn.addEventListener("click", () => {
      this.resultContainer.empty();
      this.resultMarkdown = "";
    });
    this.clearOutputBtn = clearOutputBtn;

    // 保存按钮
    const saveBtn = bottomBar.createEl("button", { text: t("lookup_save_button"), cls: "mod-cta" });
    saveBtn.addEventListener("click", () => this.saveWord());
    this.saveBtn = saveBtn;
  }

  // === 本地查询相关方法 ===
  createLocalCard(card, container) {
    const cardDiv = container.createDiv({ cls: "word-card" });
    const colorMap = { red: "var(--color-red)", orange: "var(--color-orange)", yellow: "var(--color-yellow)", green: "var(--color-green)", blue: "var(--color-blue)", purple: "var(--color-purple)" };
    cardDiv.style.setProperty("--card-color", colorMap[card.color] || "var(--interactive-accent)");

    // 操作按钮（掌握/忽略）
    const actionsDiv = cardDiv.createDiv({ cls: "card-actions" });
    if (this.plugin.settings.enableMastery) {
      const masteryBtn = actionsDiv.createDiv({ cls: "action-icon" });
      const isMastered = this.plugin.masteryStore.isMastered(card._stateKey || card.word);
      setIcon(masteryBtn, isMastered ? "meh" : "smile");
      masteryBtn.classList.add(isMastered ? "icon-meh" : "icon-smile");
      masteryBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const newState = !isMastered;
        await this.plugin.masteryStore.setMastered(card._stateKey || card.word, newState);
        await this.plugin.highlighter.refresh();
        this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
        this.doLocalLookup(this.currentWord);
      });
    }
    const ignoreBtn = actionsDiv.createDiv({ cls: "action-icon" });
    const isIgnored = this.plugin.masteryStore.isIgnored(card._stateKey || card.word);
    setIcon(ignoreBtn, isIgnored ? "eye-off" : "eye");
    ignoreBtn.classList.add(isIgnored ? "icon-eye-off" : "icon-eye");
    ignoreBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const newIgnore = !isIgnored;
      await this.plugin.masteryStore.setIgnored(card._stateKey || card.word, newIgnore);
      await this.plugin.highlighter.refresh();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
      this.doLocalLookup(this.currentWord);
    });

    // 单词行
    const wordLine = cardDiv.createDiv({ cls: "word-line" });
    const wordSpan = wordLine.createSpan({ cls: "word", text: card.word });
    wordSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      playPronunciation(card.word, this.plugin.settings.ttsUrlTemplate, this.plugin.settings.pronunciationVariant);
    });

    // ★★★ 显示匹配程度标签 ★★★
    const matchType = card._matchType;
    if (matchType) {
      const label = wordLine.createSpan({ cls: "match-type-label" });
      const labelMap = {
        'exact': t("match_label_exact"),
        'prefix': t("match_label_prefix"),
        'contains': t("match_label_contains"),
        'fuzzy': t("match_label_fuzzy"),
        'alias_exact': t("match_label_alias_exact"),
        'alias_prefix': t("match_label_alias_prefix"),
        'alias_contains': t("match_label_alias_contains"),
        'alias_fuzzy': t("match_label_alias_fuzzy")
      };
      label.textContent = labelMap[matchType] || matchType;
      label.style.fontSize = '0.65em';
      label.style.marginLeft = '8px';
      label.style.padding = '1px 6px';
      label.style.borderRadius = '3px';
      label.style.backgroundColor = 'var(--background-secondary)';
      label.style.color = 'var(--text-muted)';
      label.style.border = '1px solid var(--background-modifier-border)';
      label.style.whiteSpace = 'nowrap';
    }

    // 释义区域
    const defDiv = cardDiv.createDiv({ cls: "definition" });
    if (this.plugin.settings.enableBlurDefinition) defDiv.classList.add("blur");

    const sections = card.sections || [{ title: "释义", content: card.definition || "" }];
    const hasMultipleSections = sections.length > 1;
    let tabBar = null;
    if (hasMultipleSections) {
      tabBar = defDiv.createDiv({ cls: "word-card-tab-bar" });
      tabBar.style.display = "flex";
      tabBar.style.gap = "6px";
      tabBar.style.marginBottom = "4px";
      tabBar.style.flexWrap = "wrap";
    }

    const contentContainer = defDiv.createDiv({ cls: "word-card-content" });
    contentContainer.setText(t("notice_loading_definition"));

    // 存储元数据供渲染
    cardDiv._wordData = card;
    cardDiv._sections = sections;
    cardDiv._tabBar = tabBar;
    cardDiv._contentContainer = contentContainer;
    cardDiv._defDiv = defDiv;
    cardDiv._hasMultipleSections = hasMultipleSections;

    if (this.plugin.settings.enableBlurDefinition) {
      defDiv.addEventListener("mouseenter", () => defDiv.classList.remove("blur"));
      defDiv.addEventListener("mouseleave", () => defDiv.classList.add("blur"));
    }

    // 来源文件名
    const sourceDiv = cardDiv.createDiv({ cls: "source", text: card.sourceFile.split('/').pop() });

    // 渲染释义内容
    this._renderLocalCardContent(cardDiv);

    return cardDiv;
  }

  // 渲染卡片内容
  async _renderLocalCardContent(cardDiv) {
    const wordObj = cardDiv._wordData;
    const sections = cardDiv._sections;
    const contentContainer = cardDiv._contentContainer;
    const tabBar = cardDiv._tabBar;
    const hasMultipleSections = cardDiv._hasMultipleSections;

    const renderContent = async (index) => {
      contentContainer.empty();
      const section = sections[index];
      if (section) {
        let content = section.content;
        if (section.title === "释义" && wordObj.phonetic) {
          const phoneticHtml = `<span class="card-phonetic">${wordObj.phonetic}</span>`;
          content = `${phoneticHtml}\n\n${content}`;
        }
        const processed = processLineBreaks(content);
        await MarkdownRenderer.render(this.plugin.app, processed, contentContainer, wordObj.sourceFile, this.plugin);
        fixInternalLinks(contentContainer, this.plugin.app, wordObj.sourceFile);
      } else {
        contentContainer.setText(t("no_definition"));
      }
    };

    if (tabBar) {
      tabBar.empty();
      sections.forEach((section, idx) => {
        const tab = tabBar.createDiv({ cls: "word-card-tab" });
        tab.textContent = section.title;
        tab.style.cursor = "pointer";
        tab.style.padding = "2px 6px";
        tab.style.borderRadius = "3px";
        tab.style.fontSize = "0.8em";
        tab.style.color = idx === 0 ? "var(--text-accent)" : "var(--text-muted)";
        if (idx === 0) tab.style.fontWeight = "bold";
        tab.addEventListener("click", async (e) => {
          e.stopPropagation();
          tabBar.querySelectorAll(".word-card-tab").forEach(t => {
            t.style.color = "var(--text-muted)";
            t.style.fontWeight = "normal";
          });
          tab.style.color = "var(--text-accent)";
          tab.style.fontWeight = "bold";
          await renderContent(idx);
        });
      });
    }
    await renderContent(0);
  }

  refreshPromptSelect() {
    if (!this.promptSelect) return;
    const select = this.promptSelect;
    select.empty();
    // 默认选项
    select.createEl("option", { value: "默认", text: t("lookup_default_prompt_option") });
    // 自定义
    const customs = this.plugin.settings.customPrompts || [];
    for (const p of customs) {
      select.createEl("option", { value: p.name, text: p.name });
    }
    const selected = this.plugin.settings.selectedPrompt || "默认";
    select.value = selected;
  }

  // 计算卡片与输入词的匹配得分，返回 { score, matchType }
  // mode: "smart" | "exact" | "prefix" | "contains" | "fuzzy"
  _scoreCard(card, inputLower, mode) {
    const wordLower = card.word.toLowerCase();
    const aliases = card.aliases || [];
    let bestScore = 0;
    let bestType = null;

    const evaluate = (word, source) => {
      if (word === inputLower) return { score: 100, type: source === 'word' ? 'exact' : 'alias_exact' };
      if (word.startsWith(inputLower)) return { score: 80, type: source === 'word' ? 'prefix' : 'alias_prefix' };
      if (word.includes(inputLower)) return { score: 60, type: source === 'word' ? 'contains' : 'alias_contains' };
      const dist = levenshteinDistance(word, inputLower);
      if (dist <= 2) {
        const score = Math.max(0, 50 - dist * 20);
        return { score, type: source === 'word' ? 'fuzzy' : 'alias_fuzzy' };
      }
      return { score: 0, type: null };
    };

    // 评估单词本身
    const wordResult = evaluate(wordLower, 'word');
    if (wordResult.score > bestScore) {
      bestScore = wordResult.score;
      bestType = wordResult.type;
    }

    // 评估所有别名（取最高分，权重0.8）
    for (const alias of aliases) {
      const aliasLower = alias.toLowerCase();
      const aliasResult = evaluate(aliasLower, 'alias');
      const adjustedScore = aliasResult.score * 0.8;
      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestType = aliasResult.type;
      }
    }

    // 根据模式过滤
    if (mode !== 'smart') {
      let allowedTypes = [];
      if (mode === 'exact') {
        allowedTypes = ['exact', 'alias_exact'];
      } else if (mode === 'prefix') {
        allowedTypes = ['exact', 'prefix', 'alias_exact', 'alias_prefix'];
      } else if (mode === 'contains') {
        allowedTypes = ['exact', 'prefix', 'contains', 'alias_exact', 'alias_prefix', 'alias_contains'];
      } else if (mode === 'fuzzy') {
        allowedTypes = ['exact', 'prefix', 'contains', 'fuzzy', 'alias_exact', 'alias_prefix', 'alias_contains', 'alias_fuzzy'];
      }
      if (!allowedTypes.includes(bestType)) {
        return { score: 0, matchType: null };
      }
    }

    return { score: bestScore, matchType: bestType };
  }

  doLocalLookup(word) {
    if (!word || !word.trim()) {
      new Notice(t("lookup_empty_word"));
      return;
    }
    this.currentWord = word.trim();
    const inputLower = this.currentWord.toLowerCase();

    // 读取设置
    const mode = this.plugin.settings.localSearchMode || "smart";
    const maxResults = this.plugin.settings.maxLocalResults || 10;

    const allCards = this.plugin.getAllCards();

    // 计算每个卡片的得分和匹配类型
    const scored = allCards
      .map(card => {
        const { score, matchType } = this._scoreCard(card, inputLower, mode);
        return { card, score, matchType };
      })
      .filter(item => item.score > 0);

    // 排序：得分降序，得分相同按单词长度升序（短词优先）
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.card.word.length - b.card.word.length;
    });

    // 截断
    const topScored = scored.slice(0, maxResults);

    // 提取卡片，附加匹配类型
    const matches = topScored.map(item => {
      const card = item.card;
      card._matchType = item.matchType;
      return card;
    });

    this.resultContainer.empty();
    if (matches.length === 0) {
      this.resultContainer.setText(t("lookup_no_local_match"));
      this.resultMarkdown = "";
      this.localNotFound = true;
      return;
    }
    this.localNotFound = false;

    // 渲染卡片
    for (const card of matches) {
      const stateKey = this.plugin.settings.masteryMode === "global" ? card.word : `${card.sourceFile}::${card.word}`;
      card._stateKey = stateKey;
      this.createLocalCard(card, this.resultContainer);
    }
  }

  async doAILookup(word) {
    if (!word || !word.trim()) {
      new Notice(t("lookup_empty_word"));
      return;
    }
    this.currentWord = word.trim();
    const promptName = this.promptSelect ? this.promptSelect.value : "默认";
    this.currentPromptName = promptName;

    // 获取提示词内容
    let promptContent;
    if (promptName === "默认") {
      promptContent = this.plugin.settings.defaultPrompt || "请解释单词 {word}";
    } else {
      const custom = this.plugin.settings.customPrompts.find(p => p.name === promptName);
      promptContent = custom ? custom.content : this.plugin.settings.defaultPrompt;
    }
    if (!promptContent) {
      new Notice(t("notice_prompt_empty"));
      return;
    }
    const finalPrompt = promptContent.replace(/{word}/g, this.currentWord);

    this.setLoading(true);
    this.resultContainer.empty();
    this.resultContainer.setText(t("lookup_loading"));

    try {
      const response = await this.plugin.callAI(finalPrompt);
      this.resultMarkdown = response || "";
      this.resultContainer.empty();
      // 如果需要显示回退提示，先添加提示
      if (this._showFallbackHint) {
        const hint = document.createElement("div");
        hint.className = "lookup-fallback-hint";
        hint.textContent = t("local_not_found_ai_fallback");
        hint.style.cssText = "background: var(--background-secondary); padding: 6px 10px; border-radius: 4px; margin-bottom: 8px; font-size: 0.9em; color: var(--text-muted);";
        this.resultContainer.appendChild(hint);
        this._showFallbackHint = false;
      }
      await MarkdownRenderer.render(
        this.plugin.app,
        this.resultMarkdown,
        this.resultContainer,
        "",
        this.plugin
      );
      fixInternalLinks(this.resultContainer, this.plugin.app, "");
    } catch (err) {
      new Notice(t("lookup_error_prefix") + err.message);
      this.resultContainer.setText(t("lookup_error_prefix") + err.message);
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.isLoading = loading;
    if (this.localBtn) {
      this.localBtn.disabled = loading;
    }
    if (this.aiBtn) {
      this.aiBtn.disabled = loading;
    }
    if (this.saveBtn) {
      this.saveBtn.disabled = loading;
    }
  }

  // 从文本中提取音标（增强版，支持多种格式）
  extractPhonetic(text) {
    // 匹配方括号或斜杠包裹的音标
    const phoneticRegex = /\[[^\]]+\]|\/[^\/]+\//g;
    const labelSet = ['英', '美', 'UK', 'US', 'BrE', 'AmE', 'Br', 'Am', '英式', '美式', '英音', '美音', 'British', 'American'];
    // ★★★ 修复：添加 'g' 标志以支持 matchAll ★★★
    const labelRegex = new RegExp(labelSet.join('|'), 'gi');
    let matches = [];
    let match;
    while ((match = phoneticRegex.exec(text)) !== null) {
      const ph = match[0];
      const index = match.index;
      const before = text.slice(Math.max(0, index - 30), index);
      // 找出所有匹配的标签，选择最靠近音标的（即索引最大的）
      const allLabelMatches = [...before.matchAll(labelRegex)];
      let bestMatch = null;
      let bestIndex = -1;
      for (const m of allLabelMatches) {
        if (m.index > bestIndex) {
          bestIndex = m.index;
          bestMatch = m;
        }
      }
      if (bestMatch) {
        const label = bestMatch[0];
        // 检查标签与音标之间是否合理（不能有换行或句号）
        const between = text.slice(bestMatch.index + label.length, index);
        if (!between.includes('\n') && !between.includes('。')) {
          matches.push({ label: label.trim(), phonetic: ph });
          continue;
        }
      }
      // 无有效标签，作为独立音标
      matches.push({ phonetic: ph });
    }
    const hasLabel = matches.some(m => m.label);
    if (hasLabel) {
      // 按标签+音标去重
      const unique = new Map();
      for (const m of matches) {
        if (!m.label) continue;
        const key = m.label + ':' + m.phonetic;
        if (!unique.has(key)) unique.set(key, m);
      }
      return Array.from(unique.values()).map(m => `${m.label} ${m.phonetic}`).join(' ');
    } else {
      return matches.map(m => m.phonetic).join(' ');
    }
  }

  async saveWord() {
    if (!this.currentWord || !this.resultMarkdown) {
      new Notice(t("lookup_no_content"));
      return;
    }
    const phonetic = this.extractPhonetic(this.resultMarkdown);
    // 查找可写的词库
    const writable = this.plugin.settings.wordbookFiles.find(f => f.enabled && !f.readonly);
    if (!writable) {
      new Notice(t("lookup_no_writable_book"));
      return;
    }
    const card = {
      word: this.currentWord,
      definition: this.resultMarkdown,
      phonetic: phonetic,
      aliases: [],
      color: "",
      sourceFile: writable.path
    };
    const modal = new WordModal(this.plugin.app, this.plugin, card);
    modal.open();
  }
}

// ========== 辅助类 ==========
class ConfirmModal extends Modal {
  constructor(app, onConfirm, onCancel) { super(app); this.onConfirm = onConfirm; this.onCancel = onCancel; }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("p", { text: t("delete_confirm") });
    const buttonDiv = contentEl.createDiv({ cls: "modal-button-container" });
    const confirmBtn = buttonDiv.createEl("button", { text: t("confirm"), cls: "mod-cta" });
    const cancelBtn = buttonDiv.createEl("button", { text: t("cancel") });
    confirmBtn.addEventListener("click", () => { this.close(); this.onConfirm(); });
    cancelBtn.addEventListener("click", () => { this.close(); this.onCancel(); });
  }
}

class WordContextMenu {
  constructor(plugin, wordObj) { this.plugin = plugin; this.wordObj = wordObj; }
  showAtMouseEvent(e) {
    const menu = new (require('obsidian').Menu)();
    const fileSetting = this.plugin.settings.wordbookFiles.find(f => f.path === this.wordObj.sourceFile);
    const isReadonly = fileSetting ? fileSetting.readonly : false;
    let hasItems = false;
    if (!isReadonly) {
      menu.addItem(item => item.setTitle(t("edit")).setIcon("pencil").onClick(() => this.editWord()));
      menu.addItem(item => item.setTitle(t("delete")).setIcon("trash").onClick(() => this.deleteWord()));
      hasItems = true;
    }
    if (hasItems) {
      menu.showAtMouseEvent(e);
    }
  }
  async editWord() {
    const fileSetting = this.plugin.settings.wordbookFiles.find(f => f.path === this.wordObj.sourceFile);
    if (fileSetting && fileSetting.readonly) {
      new Notice(t("notice_readonly_cannot_edit"));
      return;
    }
    new WordModal(this.plugin.app, this.plugin, this.wordObj).open();
  }
  async deleteWord() {
    const fileSetting = this.plugin.settings.wordbookFiles.find(f => f.path === this.wordObj.sourceFile);
    if (fileSetting && fileSetting.readonly) {
      new Notice(t("notice_readonly_cannot_delete"));
      return;
    }
    const confirmed = await new Promise((resolve) => { const modal = new ConfirmModal(this.plugin.app, () => resolve(true), () => resolve(false)); modal.open(); });
    if (!confirmed) return;
    const success = await WordbookParser.deleteCard(this.plugin.app, this.wordObj.sourceFile, this.wordObj.word);
    if (success) {
      new Notice(t("word_deleted", this.wordObj.word));
      await this.plugin.reloadAllCards();
      await this.plugin.highlighter.refresh();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
    } else new Notice(t("delete_failed"));
  }
}

class WordModal extends Modal {
  constructor(app, plugin, existingCard = null, sentence = "") {
    super(app);
    this.plugin = plugin;
    this.existingCard = existingCard;
    this.word = existingCard?.word || "";
    this.sentence = sentence;
    this.definition = existingCard?.definition || "";
    this.aliasesStr = existingCard?.aliases?.join(", ") || "";
    this.color = existingCard?.color || "";
    this.selectedFile = existingCard?.sourceFile || "";
    this.phonetic = existingCard?.phonetic || "";
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("simple-wordbook-modal");
    this.titleEl.setText(this.existingCard ? t("edit_word_title") : t("add_word_title"));

    new Setting(contentEl).setName(t("word_label")).addText(text => {
      text.setValue(this.word);
      text.onChange(val => this.word = val);
      text.inputEl.placeholder = "e.g. take";
    });

    new Setting(contentEl).setName(t("phonetic_label")).addText(text => {
      text.setValue(this.phonetic);
      text.onChange(val => this.phonetic = val);
      text.inputEl.placeholder = "e.g. teɪk";
    });

    const defSetting = new Setting(contentEl).setName(t("definition_label"));
    defSetting.addTextArea(area => {
      area.setValue(this.definition);
      area.onChange(val => this.definition = val);
      area.inputEl.rows = 6;
      area.inputEl.style.width = "100%";
      area.inputEl.style.resize = 'vertical';
      area.inputEl.placeholder = t("definition_placeholder");
    });

    new Setting(contentEl).setName(t("aliases_label")).addText(text => {
      text.setValue(this.aliasesStr);
      text.onChange(val => this.aliasesStr = val);
      text.inputEl.placeholder = "e.g. takes, took, taken, taking";
    });

    const files = this.plugin.settings.wordbookFiles.filter(f => f.enabled && !f.readonly);
    if (!this.selectedFile && files.length > 0) this.selectedFile = files[0].path;
    new Setting(contentEl).setName(t("wordbook_label")).addDropdown(drop => {
      files.forEach(f => drop.addOption(f.path, f.name));
      if (this.selectedFile && files.some(f => f.path === this.selectedFile)) {
        drop.setValue(this.selectedFile);
      } else if (files.length > 0) {
        this.selectedFile = files[0].path;
        drop.setValue(this.selectedFile);
      }
      drop.onChange(val => this.selectedFile = val);
    });

    const colorSetting = new Setting(contentEl).setName(t("card_color_label"));
    const colors = [
      { value: "", label: t("color_default"), color: "var(--interactive-accent)" },
      { value: "red", label: t("color_red"), color: "var(--color-red)" },
      { value: "orange", label: t("color_orange"), color: "var(--color-orange)" },
      { value: "yellow", label: t("color_yellow"), color: "var(--color-yellow)" },
      { value: "green", label: t("color_green"), color: "var(--color-green)" },
      { value: "blue", label: t("color_blue"), color: "var(--color-blue)" },
      { value: "purple", label: t("color_purple"), color: "var(--color-purple)" }
    ];
    let colorPreview = null;
    colorSetting.addDropdown(drop => {
      colors.forEach(c => drop.addOption(c.value, c.label));
      drop.setValue(this.color);
      drop.onChange(val => {
        this.color = val;
        if (colorPreview) {
          const found = colors.find(c => c.value === val);
          colorPreview.style.backgroundColor = found ? found.color : colors[0].color;
        }
      });
    });
    colorPreview = document.createElement("span");
    colorPreview.className = "wordbook-color-preview";
    const colorMap = { red: "var(--color-red)", orange: "var(--color-orange)", yellow: "var(--color-yellow)", green: "var(--color-green)", blue: "var(--color-blue)", purple: "var(--color-purple)" };
    colorPreview.style.backgroundColor = colorMap[this.color] || "var(--interactive-accent)";
    colorSetting.controlEl.appendChild(colorPreview);

    const buttonDiv = contentEl.createDiv({ cls: "wordbook-modal-buttons" });
    buttonDiv.style.display = "flex";
    buttonDiv.style.justifyContent = "flex-end";
    buttonDiv.style.gap = "8px";
    buttonDiv.style.flexWrap = "nowrap";
    buttonDiv.style.marginTop = "20px";

    const saveBtn = buttonDiv.createEl("button", { text: t("save"), cls: "mod-cta" });
    saveBtn.addEventListener("click", () => this.save());

    const cancelBtn = buttonDiv.createEl("button", { text: t("cancel") });
    cancelBtn.addEventListener("click", () => this.close());
  }

  async save() {
    if (!this.word) { new Notice(t("word_required")); return; }
    if (!this.selectedFile) { new Notice(t("select_wordbook")); return; }
    const fileSetting = this.plugin.settings.wordbookFiles.find(f => f.path === this.selectedFile);
    if (!fileSetting || !fileSetting.enabled || fileSetting.readonly) {
      new Notice(t("notice_readonly_cannot_save"));
      return;
    }
    const aliases = this.aliasesStr ? this.aliasesStr.split(',').map(s => s.trim()).filter(s => s) : [];
    const card = {
      word: this.word,
      aliases: aliases,
      definition: this.definition || "",
      color: this.color || "",
      sourceFile: this.selectedFile,
      phonetic: this.phonetic || ""
    };
    try {
      await WordbookParser.saveCard(this.app, this.selectedFile, card, !this.existingCard);
      const action = this.existingCard ? t("word_updated") : t("word_added");
      new Notice(t("word_saved", action));
      setTimeout(async () => {
        await this.plugin.reloadAllCards();
        await this.plugin.highlighter.refresh();
        this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
      }, 300);
      this.close();
    } catch (e) {
      new Notice(t("save_failed"));
      console.error(e);
    }
  }
}

// ========== 设置界面 ==========
class WordbookSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.activeTabId = 'files'; // 默认文件管理
    this._skipCount = false;   // 控制是否跳过计数
    this._wordCountCache = {};      // 缓存 { [filePath]: count }
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.style.paddingTop = '0';
    containerEl.style.marginTop = '0';

    // 创建标签栏
    const tabBar = containerEl.createDiv({ cls: "wordbook-setting-tab-bar" });
    const tabFiles = tabBar.createDiv({ cls: "wordbook-setting-tab" });
    setIcon(tabFiles, "folder");
    tabFiles.createSpan({ text: t("settings_tab_files") });
    const tabGeneral = tabBar.createDiv({ cls: "wordbook-setting-tab" });
    setIcon(tabGeneral, "sliders-horizontal");
    tabGeneral.createSpan({ text: t("settings_tab_general") });
    const tabAI = tabBar.createDiv({ cls: "wordbook-setting-tab" });
    setIcon(tabAI, "bot");
    tabAI.createSpan({ text: t("settings_tab_ai") });

    // 创建三个内容容器
    const filesContainer = containerEl.createDiv({ cls: "wordbook-setting-files-container" });
    const generalContainer = containerEl.createDiv({ cls: "wordbook-setting-general-container" });
    generalContainer.style.display = "none";
    const aiContainer = containerEl.createDiv({ cls: "wordbook-setting-ai-container" });
    aiContainer.style.display = "none";

    // 填充内容
    this.buildFilesTab(filesContainer);
    this.buildGeneralTab(generalContainer);
    this.buildAITab(aiContainer);

    // 切换逻辑
    const activateTab = (tabId) => {
      // 移除所有active类
      [tabFiles, tabGeneral, tabAI].forEach(el => el.classList.remove('active'));
      // 隐藏所有容器
      filesContainer.style.display = "none";
      generalContainer.style.display = "none";
      aiContainer.style.display = "none";

      // 根据tabId显示对应的标签和容器
      if (tabId === 'files') {
        tabFiles.classList.add('active');
        filesContainer.style.display = "block";
      } else if (tabId === 'general') {
        tabGeneral.classList.add('active');
        generalContainer.style.display = "block";
      } else if (tabId === 'ai') {
        tabAI.classList.add('active');
        aiContainer.style.display = "block";
      }
      this.activeTabId = tabId;
    };

    // 绑定点击事件
    tabFiles.addEventListener("click", () => activateTab('files'));
    tabGeneral.addEventListener("click", () => activateTab('general'));
    tabAI.addEventListener("click", () => activateTab('ai'));

    // 根据保存的状态激活
    activateTab(this.activeTabId || 'files');

    // 根据标志决定是否计数，并复位标志
    if (!this._skipCount) {
      this.updateWordCounts();
    }
    this._skipCount = false;
  }

  buildFilesTab(container) {
    // ===== 单词本文件 =====
    container.createEl("h3", { text: t("settings_wordbook_files") });

    const buttonContainer = container.createDiv({ cls: "wordbook-button-container" });
    buttonContainer.style.cssText = "display: flex; gap: 8px; margin-bottom: 4px;";

    const addBtn = buttonContainer.createEl("button", { text: t("settings_add_wordbook") });
    addBtn.addEventListener("click", () => this.selectWordbookFile());

    const refreshBtn = buttonContainer.createEl("button");
    setIcon(refreshBtn, "refresh-cw");
    refreshBtn.setAttribute("aria-label", t("refresh_wordbook"));
    refreshBtn.style.cursor = "pointer";
    refreshBtn.style.marginLeft = "16px";
    refreshBtn.addEventListener("click", async () => {
      await this.plugin.reloadAllCards(true);
      await this.plugin.highlighter.refresh();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
      new Notice(t("wordbook_refreshed"));
      await this.updateWordCounts();  // 手动更新当前设置界面的计数
    });

    const desc = container.createEl("div", { text: t("settings_add_wordbook_desc") });
    desc.style.cssText = "font-size: 0.85em; color: var(--text-muted); margin-top: 4px; margin-bottom: 12px;";

    // 单词本列表
    for (let idx = 0; idx < this.plugin.settings.wordbookFiles.length; idx++) {
      const file = this.plugin.settings.wordbookFiles[idx];
      const fileExists = this.app.vault.getAbstractFileByPath(file.path) instanceof TFile;
      if (!fileExists) {
        const setting = new Setting(container)
          .setName(file.name)
          .setDesc(`⚠️ File not found: ${file.path}`)
          .addButton(btn => btn.setIcon("trash").setTooltip("Remove").onClick(async () => {
            this.plugin.settings.wordbookFiles.splice(idx, 1);
            delete this._wordCountCache[file.path];   // 从缓存中移除
            await this.plugin.saveSettings();
            await this.plugin.reloadAllCards();
            await this.plugin.highlighter.refresh();
            this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
            this._skipCount = true;
            this.display();
          }));

        const nameEl = setting.settingEl.querySelector('.setting-item-name');
        if (nameEl) {
          nameEl.dataset.path = file.path;
          nameEl.dataset.originalName = file.name;
        }
        continue;
      }

      const setting = new Setting(container)
        .setName(file.name)   // 先设置原始名称
        .setDesc(file.path)
        .addToggle(toggle => toggle.setValue(file.enabled).onChange(async (val) => {
          file.enabled = val;
          await this.plugin.saveSettings();
          await this.plugin.reloadAllCards();
          await this.plugin.highlighter.refresh();
          this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
        }))
        .addButton(btn => btn.setIcon("trash").setTooltip("Remove").onClick(async () => {
          this.plugin.settings.wordbookFiles.splice(idx, 1);
          delete this._wordCountCache[file.path];   // 从缓存中移除
          await this.plugin.saveSettings();
          await this.plugin.reloadAllCards();
          await this.plugin.highlighter.refresh();
          this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
          this._skipCount = true;
          this.display();
        }));

      const nameEl = setting.settingEl.querySelector('.setting-item-name');
      if (nameEl) {
        nameEl.dataset.path = file.path;
        nameEl.dataset.originalName = file.name;
        // 从缓存中读取数字并显示
        const cached = this._wordCountCache[file.path];
        if (cached !== undefined && cached >= 0) {
          nameEl.textContent = `${file.name} ${t("word_count", cached)}`;
        } else if (cached === -1) {
          nameEl.textContent = `${file.name} ${t("word_count_error")}`;
        } else {
          nameEl.textContent = file.name;   // 无缓存，仅显示文件名
        }
      }

      // 只读锁
      const controlEl = setting.controlEl;
      const lockIcon = document.createElement('span');
      lockIcon.style.cssText = "cursor:pointer; margin-left:8px; display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; border-radius:4px; transition:background-color 0.2s;";
      const updateLock = () => {
        const isReadonly = file.readonly || false;
        setIcon(lockIcon, isReadonly ? 'lock' : 'lock-open');
        lockIcon.style.color = isReadonly ? 'var(--text-error)' : 'var(--text-success)';
        lockIcon.title = isReadonly ? t("toggle_writable") : t("toggle_readonly");
      };
      updateLock();
      lockIcon.addEventListener('click', async (e) => {
        e.stopPropagation();
        file.readonly = !file.readonly;
        await this.plugin.saveSettings();
        updateLock();
        new Notice(file.readonly ? t("notice_file_readonly", file.name) : t("notice_file_writable", file.name));
      });
      const buttons = controlEl.querySelectorAll('button');
      if (buttons.length > 0) {
        controlEl.insertBefore(lockIcon, buttons[0]);
      } else {
        controlEl.appendChild(lockIcon);
      }

      // 拖拽排序
      const settingEl = setting.settingEl;
      settingEl.draggable = true;
      settingEl.dataset.index = idx;
      settingEl.style.cursor = "grab";
      const dragInfoEl = settingEl.querySelector('.setting-item-info');
      if (dragInfoEl) {
        const handle = document.createElement('span');
        handle.className = 'drag-handle';   // ★ 拖拽手柄类名
        handle.style.cssText = "margin-right:8px; display:inline-flex; align-items:center; color:var(--text-muted);";
        setIcon(handle, 'grip-vertical');
        dragInfoEl.parentNode.insertBefore(handle, dragInfoEl);
      }
      settingEl.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", String(idx));
        e.dataTransfer.effectAllowed = "move";
        settingEl.style.opacity = "0.5";
      });
      settingEl.addEventListener("dragend", () => { settingEl.style.opacity = "1"; });
      settingEl.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        settingEl.style.borderBottom = "2px solid var(--interactive-accent)";
      });
      settingEl.addEventListener("dragleave", () => { settingEl.style.borderBottom = ""; });
      settingEl.addEventListener("drop", async (e) => {
        e.preventDefault();
        settingEl.style.borderBottom = "";
        const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
        const toIndex = parseInt(settingEl.dataset.index);
        if (fromIndex === toIndex) return;
        const files = this.plugin.settings.wordbookFiles;
        const [movedItem] = files.splice(fromIndex, 1);
        files.splice(toIndex, 0, movedItem);
        await this.plugin.saveSettings();

        // 只重新排序卡片，不重新解析文件（内容未变，只调整优先级顺序）
        this.plugin.reorderCards();               // 重新排列 allCardsCache 并重建 sidebarTrie
        await this.plugin.highlighter.refresh();  // 重建高亮 Trie 并刷新视图
        this.plugin.app.workspace.trigger("simple-wordbook:data-updated");

        this._skipCount = true;
        this.display();
      });
    }

    // ===== 掌握/忽略管理 =====
    container.createEl("h3", { text: t("settings_progress_management") });

    new Setting(container)
      .setName(t("settings_mastery_mode"))
      .setDesc(t("settings_mastery_mode_desc"))
      .addDropdown(async (drop) => {
        drop.addOption("per-source", t("mastery_mode_per_source")).addOption("global", t("mastery_mode_global"))
          .setValue(this.plugin.settings.masteryMode || "per-source")
          .onChange(async (val) => {
            if (val === this.plugin.settings.masteryMode) return;
            const oldMode = this.plugin.settings.masteryMode;
            this.plugin.settings.masteryMode = val;
            await this.plugin.saveSettings();
            if (oldMode === "per-source" && val === "global") {
              await this.plugin.masteryStore.migrateFromPerSourceToGlobal();
            } else if (oldMode === "global" && val === "per-source") {
              await this.plugin.masteryStore.migrateFromGlobalToPerSource();
            }
            await this.plugin.reloadAllCards(true);
            await this.plugin.highlighter.refresh();
            this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
            const modeLabel = val === "global" ? t("mastery_mode_global") : t("mastery_mode_per_source");
            new Notice(t("settings_mastery_mode_switched", modeLabel));
            this._skipCount = true;
            this.display();
          });
      });

    new Setting(container)
      .setName(t("settings_mastery_file"))
      .setDesc(t("settings_mastery_path_desc"))
      .addText(text => {
        text.setPlaceholder("_wordbook_mastery.json")
          .setValue(this.plugin.settings.masteryFilePath)
          .onChange(async (val) => {
            this.plugin.settings.masteryFilePath = val;
            await this.plugin.saveSettings();
            await this.plugin.masteryStore.load();
            await this.plugin.highlighter.refresh();
            this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
          });
        return text;
      })
      .addButton(btn => {
        btn.setButtonText(t("restore_default"))
          .setTooltip(t("restore_default_tooltip"))
          .onClick(async () => {
            const defaultPath = this.getDefaultMasteryPath();
            this.plugin.settings.masteryFilePath = defaultPath;
            await this.plugin.saveSettings();
            await this.plugin.masteryStore.load();
            await this.plugin.highlighter.refresh();
            this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
            this._skipCount = true;
            this.display();
          });
      });

    new Setting(container)
      .setName(t("settings_ignored_file"))
      .setDesc(t("settings_ignored_path_desc"))
      .addText(text => {
        text.setPlaceholder("_wordbook_ignored.json")
          .setValue(this.plugin.settings.ignoredFilePath)
          .onChange(async (val) => {
            this.plugin.settings.ignoredFilePath = val;
            await this.plugin.saveSettings();
            await this.plugin.masteryStore.load();
            await this.plugin.highlighter.refresh();
            this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
          });
        return text;
      })
      .addButton(btn => {
        btn.setButtonText(t("restore_default"))
          .setTooltip(t("restore_default_tooltip"))
          .onClick(async () => {
            const defaultPath = this.getDefaultIgnoredPath();
            this.plugin.settings.ignoredFilePath = defaultPath;
            await this.plugin.saveSettings();
            await this.plugin.masteryStore.load();
            await this.plugin.highlighter.refresh();
            this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
            this._skipCount = true;
            this.display();
          });
      });
  }

  buildGeneralTab(container) {
    // ===== 高亮与预览 =====
    container.createEl("h3", { text: t("settings_highlight_preview") });

    new Setting(container).setName(t("settings_enable_highlight")).addToggle(toggle => toggle.setValue(this.plugin.settings.enableHighlight).onChange(async (val) => {
      this.plugin.settings.enableHighlight = val;
      await this.plugin.saveSettings();
      await this.plugin.highlighter.refresh();
    }));
    new Setting(container).setName(t("settings_enable_hover")).addToggle(toggle => toggle.setValue(this.plugin.settings.enableHoverPreview).onChange(async (val) => {
      this.plugin.settings.enableHoverPreview = val;
      await this.plugin.saveSettings();
    }));
    new Setting(container).setName(t("settings_blur_definitions")).setDesc(t("settings_blur_desc")).addToggle(toggle => toggle.setValue(this.plugin.settings.enableBlurDefinition).onChange(async (val) => {
      this.plugin.settings.enableBlurDefinition = val;
      await this.plugin.saveSettings();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
    }));

    // ===== 高亮样式 =====
    container.createEl("h3", { text: t("settings_highlight_styles") });

    const colorOptions = [
      { value: "", label: t("color_default_desc") },
      { value: "#ff0000", label: t("color_red") },
      { value: "#ff7f00", label: t("color_orange") },
      { value: "#ffff00", label: t("color_yellow") },
      { value: "#00ff00", label: t("color_green") },
      { value: "#00bfff", label: t("color_blue") },
      { value: "#8a2be2", label: t("color_purple") },
      { value: "#ff69b4", label: t("color_pink") },
      { value: "#00ffff", label: t("color_cyan") }
    ];

    const mainColorSetting = new Setting(container)
      .setName(t("settings_highlight_color"))
      .setDesc(t("settings_highlight_color_desc"))
      .addDropdown(drop => {
        for (const opt of colorOptions) drop.addOption(opt.value, opt.label);
        drop.setValue(this.plugin.settings.highlightColor || "");
        drop.onChange(async (val) => {
          this.plugin.settings.highlightColor = val;
          await this.plugin.saveSettings();
          await this.plugin.highlighter.refresh();
          const newColor = val && val !== "" ? val : "var(--interactive-accent)";
          previewSpan.style.backgroundColor = newColor;
        });
        return drop;
      });
    const previewSpan = document.createElement("span");
    previewSpan.style.cssText = "display:inline-block; width:20px; height:20px; border-radius:4px; margin-left:8px; border:1px solid var(--background-modifier-border);";
    const updatePreview = () => {
      const val = this.plugin.settings.highlightColor;
      previewSpan.style.backgroundColor = val && val !== "" ? val : "var(--interactive-accent)";
    };
    updatePreview();
    mainColorSetting.controlEl.appendChild(previewSpan);

    new Setting(container).setName(t("settings_follow_card")).setDesc(t("settings_follow_card_desc")).addToggle(toggle => toggle.setValue(this.plugin.settings.followCardColor).onChange(async (val) => {
      this.plugin.settings.followCardColor = val;
      await this.plugin.saveSettings();
      await this.plugin.highlighter.refresh();
    }));

    new Setting(container).setName(t("settings_style_underline_type")).addDropdown(drop => drop.addOption("none", t("settings_style_none")).addOption("solid", t("settings_style_solid")).addOption("dashed", t("settings_style_dashed")).addOption("dotted", t("settings_style_dotted")).addOption("wavy", t("settings_style_wavy")).addOption("double", t("settings_style_double")).setValue(this.plugin.settings.highlightStyles.underlineType).onChange(async (val) => {
      this.plugin.settings.highlightStyles.underlineType = val;
      await this.plugin.saveSettings();
      await this.plugin.highlighter.refresh();
    }));

    const underlineColorSetting = new Setting(container)
      .setName(t("settings_underline_color"))
      .setDesc(t("settings_underline_color_desc"))
      .addDropdown(drop => {
        drop.addOption("", t("underline_color_default"));
        for (const opt of colorOptions) {
          if (opt.value !== "") drop.addOption(opt.value, opt.label);
        }
        drop.setValue(this.plugin.settings.underlineColor || "");
        drop.onChange(async (val) => {
          this.plugin.settings.underlineColor = val;
          await this.plugin.saveSettings();
          await this.plugin.highlighter.refresh();
          const baseColor = this.plugin.settings.highlightColor || "var(--interactive-accent)";
          const newColor = val && val !== "" ? val : baseColor;
          underlinePreview.style.backgroundColor = newColor;
        });
        return drop;
      });
    const underlinePreview = document.createElement("span");
    underlinePreview.style.cssText = "display:inline-block; width:20px; height:20px; border-radius:4px; margin-left:8px; border:1px solid var(--background-modifier-border);";
    const updateUnderlinePreview = () => {
      const val = this.plugin.settings.underlineColor;
      const baseColor = this.plugin.settings.highlightColor || "var(--interactive-accent)";
      underlinePreview.style.backgroundColor = val && val !== "" ? val : baseColor;
    };
    updateUnderlinePreview();
    underlineColorSetting.controlEl.appendChild(underlinePreview);

    new Setting(container).setName(t("settings_style_bold")).addToggle(toggle => toggle.setValue(this.plugin.settings.highlightStyles.bold).onChange(async (val) => {
      this.plugin.settings.highlightStyles.bold = val;
      await this.plugin.saveSettings();
      await this.plugin.highlighter.refresh();
    }));

    // ===== 高亮范围 =====
    container.createEl("h3", { text: t("settings_scope_title") });

    new Setting(container).setName(t("settings_scope_highlight")).setDesc(t("settings_scope_highlight_desc")).addToggle(toggle => toggle.setValue(this.plugin.settings.enableHighlightScopeFilter).onChange(async (val) => {
      this.plugin.settings.enableHighlightScopeFilter = val;
      await this.plugin.saveSettings();
      await this.plugin.highlighter.refresh();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
    }));
    new Setting(container).setName(t("settings_scope_sidebar")).setDesc(t("settings_scope_sidebar_desc")).addToggle(toggle => toggle.setValue(this.plugin.settings.enableSidebarScopeFilter).onChange(async (val) => {
      this.plugin.settings.enableSidebarScopeFilter = val;
      await this.plugin.saveSettings();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
    }));
    new Setting(container).setName(t("settings_scope_mode")).addDropdown(drop => drop.addOption("include", t("settings_scope_mode_include")).addOption("exclude", t("settings_scope_mode_exclude")).setValue(this.plugin.settings.scopeMode).onChange(async (val) => {
      this.plugin.settings.scopeMode = val;
      await this.plugin.saveSettings();
      await this.plugin.highlighter.refresh();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
    }));
    new Setting(container).setName(t("settings_scope_paths")).setDesc(t("settings_scope_paths_desc")).addTextArea(textarea => {
      textarea.setValue(this.plugin.settings.scopePaths.join('\n'));
      textarea.inputEl.addEventListener('blur', async () => {
        const raw = textarea.inputEl.value;
        let paths = raw.split('\n').map(s => s.trim()).filter(s => s);
        this.plugin.settings.scopePaths = paths;
        await this.plugin.saveSettings();
        await this.plugin.highlighter.refresh();
        this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
        textarea.setValue(paths.join('\n'));
      });
      textarea.inputEl.rows = 6;
      textarea.inputEl.style.width = "100%";
      textarea.inputEl.placeholder = t("scope_paths_placeholder");
    });

    // ===== 发音设置 =====
    container.createEl("h3", { text: t("settings_pronunciation") });
    new Setting(container).setName(t("settings_tts_template")).setDesc(t("settings_tts_desc")).addText(text => text.setValue(this.plugin.settings.ttsUrlTemplate).onChange(async (val) => {
      this.plugin.settings.ttsUrlTemplate = val;
      await this.plugin.saveSettings();
    }));
    new Setting(container).setName(t("settings_variant")).addDropdown(drop => drop.addOption("us", "US").addOption("uk", "UK").setValue(this.plugin.settings.pronunciationVariant).onChange(async (val) => {
      this.plugin.settings.pronunciationVariant = val;
      await this.plugin.saveSettings();
    }));

    // ===== 查词面板设置 =====
    container.createEl("h3", { text: t("lookup_settings_title") });

    // 回车模式
    new Setting(container)
      .setName(t("lookup_enter_mode"))
      .setDesc(t("lookup_enter_mode_desc"))
      .addDropdown(drop => {
        drop.addOption("local_only", t("settings_enter_mode_local_only"))
          .addOption("ai_only", t("settings_enter_mode_ai_only"))
          .addOption("local_first", t("settings_enter_mode_local_first"))
          .setValue(this.plugin.settings.enterMode || "local_first")
          .onChange(async (val) => {
            this.plugin.settings.enterMode = val;
            await this.plugin.saveSettings();
          });
        return drop;
      });

    // 本地查询模式
    new Setting(container)
      .setName(t("lookup_local_mode"))
      .setDesc(t("lookup_local_mode_desc"))
      .addDropdown(drop => {
        drop.addOption("smart", t("lookup_mode_smart"))
          .addOption("exact", t("lookup_mode_exact"))
          .addOption("prefix", t("lookup_mode_prefix"))
          .addOption("contains", t("lookup_mode_contains"))
          .addOption("fuzzy", t("lookup_mode_fuzzy"));
        drop.setValue(this.plugin.settings.localSearchMode || "smart");
        drop.onChange(async (val) => {
          this.plugin.settings.localSearchMode = val;
          await this.plugin.saveSettings();
        });
        return drop;
      });

    // 最大结果数
    new Setting(container)
      .setName(t("lookup_max_results"))
      .setDesc(t("lookup_max_results_desc"))
      .addText(text => {
        text.setValue(String(this.plugin.settings.maxLocalResults || 10));
        text.inputEl.type = "number";
        text.inputEl.min = 1;
        text.inputEl.max = 100;
        text.onChange(async (val) => {
          const num = parseInt(val);
          if (num > 0 && num <= 100) {
            this.plugin.settings.maxLocalResults = num;
            await this.plugin.saveSettings();
          } else {
            new Notice(t("notice_invalid_number"));
          }
        });
        return text;
      });
  }

  buildAITab(container) {
    const plugin = this.plugin;
    const settings = plugin.settings;

    container.createEl("h3", { text: t("settings_ai_provider") });

    // 服务商映射
    const providerMap = {
      openai: { url: "https://api.openai.com/v1/chat/completions", model: "gpt-3.5-turbo" },
      deepseek: { url: "https://api.deepseek.com/v1/chat/completions", model: "deepseek-chat" },
      glm: { url: "https://open.bigmodel.cn/api/paas/v4/chat/completions", model: "glm-4" },
      tongyi: { url: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", model: "qwen-turbo" },
      ollama: { url: "http://localhost:11434/api/chat", model: "llama2" },
      custom: { url: "", model: "" }
    };

    new Setting(container)
      .setName(t("settings_ai_provider"))
      .setDesc(t("settings_ai_provider_desc"))
      .addDropdown(drop => {
        const options = {
          openai: "OpenAI",
          deepseek: "DeepSeek",
          glm: "智谱 GLM",
          tongyi: "通义千问",
          ollama: "Ollama (本地)",
          custom: "自定义"
        };
        for (const [key, label] of Object.entries(options)) {
          drop.addOption(key, label);
        }
        drop.setValue(settings.apiProvider || "openai");
        drop.onChange(async (val) => {
          settings.apiProvider = val;
          if (val === "custom") {
            settings.apiBaseUrl = "";
            settings.apiModel = "";
          } else {
            const preset = providerMap[val];
            if (preset) {
              settings.apiBaseUrl = preset.url;
              settings.apiModel = preset.model;
            }
          }
          await plugin.saveSettings();
          this._skipCount = true;
          this.display(); // 刷新页面
        });
        return drop;
      });

    new Setting(container)
      .setName(t("settings_ai_api_url"))
      .addText(text => {
        text.setValue(settings.apiBaseUrl || "");
        text.setPlaceholder(settings.apiProvider === "custom" ? t("api_url_placeholder_custom") : t("api_url_placeholder_preset"));
        text.onChange(async (val) => {
          settings.apiBaseUrl = val;
          await plugin.saveSettings();
        });
        return text;
      });

    new Setting(container)
      .setName(t("settings_ai_api_key"))
      .addText(text => {
        text.setValue(settings.apiKey || "");
        text.inputEl.type = "password";
        text.setPlaceholder(t("api_key_placeholder"));
        text.onChange(async (val) => {
          settings.apiKey = val;
          await plugin.saveSettings();
        });
        return text;
      });

    new Setting(container)
      .setName(t("settings_ai_model"))
      .addText(text => {
        text.setValue(settings.apiModel || "");
        text.setPlaceholder(t("api_model_placeholder"));
        text.onChange(async (val) => {
          settings.apiModel = val;
          await plugin.saveSettings();
        });
        return text;
      });

    container.createEl("h3", { text: t("settings_ai_default_prompt") });
    new Setting(container)
      .setDesc(t("settings_ai_default_prompt_desc"))
      .addTextArea(text => {
        text.setValue(settings.defaultPrompt || "");
        text.inputEl.rows = 4;
        text.inputEl.style.width = "100%";
        text.onChange(async (val) => {
          settings.defaultPrompt = val;
          await plugin.saveSettings();
        });
        return text;
      });

    // 自定义提示词管理
    container.createEl("h4", { text: t("settings_ai_custom_prompts") });
    const customList = container.createDiv({ cls: "custom-prompts-list" });

    const renderCustomPrompts = () => {
      customList.empty();
      const prompts = settings.customPrompts || [];
      for (let i = 0; i < prompts.length; i++) {
        const p = prompts[i];
        const item = customList.createDiv({ cls: "custom-prompt-item" });
        const nameInput = item.createEl("input", { type: "text", placeholder: t("settings_ai_custom_prompt_name") });
        nameInput.value = p.name;
        nameInput.style.marginRight = "8px";
        const contentInput = item.createEl("textarea", { placeholder: t("settings_ai_custom_prompt_content") });
        contentInput.value = p.content;
        contentInput.style.flex = "1";
        const delBtn = item.createEl("button", { text: t("settings_ai_delete_prompt") });
        delBtn.addEventListener("click", async () => {
          settings.customPrompts.splice(i, 1);
          await plugin.saveSettings();
          plugin.registerPromptCommands();
          renderCustomPrompts();
          // 更新查词面板下拉
          plugin.app.workspace.getLeavesOfType(VIEW_TYPE_LOOKUP).forEach(leaf => {
            const view = leaf.view;
            if (view instanceof LookupView) view.refreshPromptSelect();
          });
        });
        // 失焦保存
        const saveItem = async () => {
          const newName = nameInput.value.trim();
          const newContent = contentInput.value.trim();
          if (!newName || !newContent) {
            new Notice(t("settings_ai_empty_name_or_content"));
            return;
          }
          if (newName !== p.name || newContent !== p.content) {
            p.name = newName;
            p.content = newContent;
            await plugin.saveSettings();
            plugin.registerPromptCommands();
            plugin.app.workspace.getLeavesOfType(VIEW_TYPE_LOOKUP).forEach(leaf => {
              const view = leaf.view;
              if (view instanceof LookupView) view.refreshPromptSelect();
            });
          }
        };
        nameInput.addEventListener("blur", saveItem);
        contentInput.addEventListener("blur", saveItem);
        nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") nameInput.blur(); });
        contentInput.addEventListener("keydown", (e) => { if (e.key === "Enter") contentInput.blur(); });
      }

      // 添加按钮
      const addRow = customList.createDiv({ cls: "custom-prompt-add-row" });
      const addBtn = addRow.createEl("button", { text: t("settings_ai_add_prompt") });
      // ===== 设置快捷键的按钮 =====
      const shortcutBtn = addRow.createEl("button", { text: t("settings_open_hotkeys") });
      shortcutBtn.style.marginLeft = "8px";
      shortcutBtn.addEventListener("click", () => {
        plugin.openHotkeysSettings();
      });
      let tempNameInput, tempContentInput, tempRow;

      addBtn.addEventListener("click", () => {
        if (tempRow) return; // 已存在空白行
        tempRow = customList.createDiv({ cls: "custom-prompt-item" });
        const nameInput = tempRow.createEl("input", { type: "text", placeholder: t("settings_ai_custom_prompt_name") });
        const contentInput = tempRow.createEl("textarea", { placeholder: t("settings_ai_custom_prompt_content") });
        contentInput.style.flex = "1";
        const cancelBtn = tempRow.createEl("button", { text: t("settings_ai_cancel") });
        cancelBtn.addEventListener("click", () => {
          tempRow.remove();
          tempRow = null;
        });
        const saveTemp = async () => {
          const name = nameInput.value.trim();
          const content = contentInput.value.trim();
          if (!name || !content) {
            new Notice(t("settings_ai_empty_name_or_content"));
            return;
          }
          if (settings.customPrompts.some(p => p.name === name)) {
            new Notice(t("settings_ai_duplicate_name"));
            return;
          }
          settings.customPrompts.push({ name, content });
          await plugin.saveSettings();
          plugin.registerPromptCommands();
          tempRow.remove();
          tempRow = null;
          renderCustomPrompts();
          plugin.app.workspace.getLeavesOfType(VIEW_TYPE_LOOKUP).forEach(leaf => {
            const view = leaf.view;
            if (view instanceof LookupView) view.refreshPromptSelect();
          });
        };
        nameInput.addEventListener("blur", saveTemp);
        contentInput.addEventListener("blur", saveTemp);
        nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") nameInput.blur(); });
        contentInput.addEventListener("keydown", (e) => { if (e.key === "Enter") contentInput.blur(); });
        tempNameInput = nameInput;
        tempContentInput = contentInput;
      });
    };
    renderCustomPrompts();

    // 测试连接
    new Setting(container)
      .setName(t("settings_ai_test_connection"))
      .addButton(btn => {
        btn.setButtonText(t("settings_ai_test_button"))
          .setCta()
          .onClick(async () => {
            const prompt = "Say 'OK' if you can hear me.";
            try {
              const result = await plugin.callAI(prompt);
              new Notice(t("settings_ai_test_success", result.slice(0, 50) + "..."));
            } catch (err) {
              new Notice(t("settings_ai_test_fail", err.message));
            }
          });
        return btn;
      });
  }

  // 异步加载并显示包含的单词总数
  async updateWordCounts() {
    const nameEls = this.containerEl.querySelectorAll('.setting-item-name[data-path]');
    for (const nameEl of nameEls) {
      const path = nameEl.dataset.path;
      const originalName = nameEl.dataset.originalName || path.split('/').pop().replace('.json', '');
      try {
        const cards = await WordbookParser.parseFile(this.app, path);
        const count = cards.length;
        this._wordCountCache[path] = count;   // 存入缓存
        nameEl.textContent = `${originalName} ${t("word_count", count)}`;
      } catch (e) {
        this._wordCountCache[path] = -1;      // 标记为错误
        nameEl.textContent = `${originalName} ${t("word_count_error")}`;
      }
    }
  }

  getDefaultMasteryPath() {
    const pluginDir = this.app.vault.configDir + "/plugins/" + this.plugin.manifest.id + "/";
    return pluginDir + "_wordbook_mastery.json";
  }

  getDefaultIgnoredPath() {
    const pluginDir = this.app.vault.configDir + "/plugins/" + this.plugin.manifest.id + "/";
    return pluginDir + "_wordbook_ignored.json";
  }

  async selectWordbookFile() {
    const files = this.app.vault.getFiles().filter(f => f.extension === "json");
    if (files.length === 0) { new Notice(t("notice_no_json")); return; }
    const modal = new FileSuggestionModal(this.app, files, async (file) => {
      if (this.plugin.settings.wordbookFiles.some(f => f.path === file.path)) {
        new Notice(t("notice_file_already_added"));
        return;
      }
      this.plugin.settings.wordbookFiles.push({ path: file.path, name: file.basename, enabled: true, readonly: false });
      await this.plugin.saveSettings();
      await this.plugin.reloadAllCards();
      await this.plugin.highlighter.refresh();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
      this.display();
    });
    modal.open();
  }
}

class FileSuggestionModal extends FuzzySuggestModal {
  constructor(app, files, onChoose) { super(app); this.files = files; this.onChoose = onChoose; }
  getItems() { return this.files; }
  getItemText(item) { return item.path; }
  onChooseItem(item) { this.onChoose(item); }
}

// ========== 主插件类 ==========
class SimpleWordbookPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.dynamicCommandIds = []; // 存储动态注册的提示词命令 ID
    globalThis.__simpleWordbookPlugin = this;
    // ===== 默认路径设置为插件文件夹 =====
    const pluginDir = this.app.vault.configDir + "/plugins/" + this.manifest.id + "/";
    if (!this.settings.masteryFilePath || this.settings.masteryFilePath.trim() === "") {
      this.settings.masteryFilePath = pluginDir + "_wordbook_mastery.json";
      await this.saveSettings();
    }
    if (!this.settings.ignoredFilePath || this.settings.ignoredFilePath.trim() === "") {
      this.settings.ignoredFilePath = pluginDir + "_wordbook_ignored.json";
      await this.saveSettings();
    }
    const adapter = this.app.vault.adapter;
    if (!(await adapter.exists(pluginDir))) {
      await adapter.mkdir(pluginDir, { recursive: true });
    }
    // 兼容旧设置
    if (this.settings.highlightStyles) {
      if (this.settings.highlightStyles.underline !== undefined) {
        if (this.settings.highlightStyles.underline) this.settings.highlightStyles.underlineType = "solid";
        delete this.settings.highlightStyles.underline;
      }
      if (this.settings.highlightStyles.dotted !== undefined) {
        if (this.settings.highlightStyles.dotted) this.settings.highlightStyles.underlineType = "dotted";
        delete this.settings.highlightStyles.dotted;
      }
      if (this.settings.highlightStyles.wavy !== undefined) {
        if (this.settings.highlightStyles.wavy) this.settings.highlightStyles.underlineType = "wavy";
        delete this.settings.highlightStyles.wavy;
      }
      if (!this.settings.highlightStyles.underlineType) this.settings.highlightStyles.underlineType = "none";
      if (this.settings.highlightStyles.bold === undefined) this.settings.highlightStyles.bold = false;
      if (this.settings.highlightStyles.background !== undefined) {
        this.settings.followCardColor = this.settings.highlightStyles.background;
        delete this.settings.highlightStyles.background;
      }
      if (this.settings.followCardColor === undefined) this.settings.followCardColor = true;
      await this.saveSettings();
    }
    // 初始化新增字段
    if (this.settings.enableHighlightScopeFilter === undefined) this.settings.enableHighlightScopeFilter = false;
    if (this.settings.enableSidebarScopeFilter === undefined) this.settings.enableSidebarScopeFilter = false;
    if (this.settings.scopeMode === undefined) this.settings.scopeMode = "include";
    if (this.settings.scopePaths === undefined) this.settings.scopePaths = [];

    this.masteryStore = new MasteryStore(this);
    await this.masteryStore.load();
    this.highlighter = new Highlighter(this);
    this.hoverPreview = new HoverPreview(this);

    this.sidebarTrie = new WordTrie();

    this.registerView(VIEW_TYPE_SIDEBAR, (leaf) => new SidebarView(leaf, this));
    this.registerView(VIEW_TYPE_LOOKUP, (leaf) => new LookupView(leaf, this));
    this.addRibbonIcon("book", t("sidebar_title"), () => this.activateSidebar());
    this.addRibbonIcon("search-code", t("lookup_view_title"), () => {
      const leaf = this.getLookupLeaf();
      this.app.workspace.revealLeaf(leaf);
    });
    this.addCommand({ id: "open-sidebar", name: t("sidebar_title"), callback: () => this.activateSidebar() });
    this.addCommand({ id: "add-word", name: t("add_word_title"), callback: () => new WordModal(this.app, this).open() });
    this.addCommand({ 
      id: "refresh-wordbook", 
      name: t("refresh_wordbook"), 
      callback: async () => {
        await this.reloadAllCards(true);
        await this.highlighter.refresh();
        this.app.workspace.trigger("simple-wordbook:data-updated");
        new Notice(t("wordbook_refreshed"));
      }
    });
    this.addCommand({
      id: "open-settings",
      name: t("command_open_settings"),
      callback: async () => {
        try {
          // 先确保设置面板打开（如果未打开）
          await this.app.setting.open();
          // 然后切换到插件标签
          await this.app.setting.openTabById(this.manifest.id);
        } catch (e) {
          console.error("Open settings failed:", e);
          new Notice(t("notice_open_settings_failed"));
        }
      }
    });
    // ===== 添加命令：打开查词面板 =====
    this.addCommand({
      id: "open-lookup-panel",
      name: t("command_open_lookup"),
      callback: () => {
        const leaf = this.getLookupLeaf();
        this.app.workspace.revealLeaf(leaf);
        const view = leaf.view;
        if (view instanceof LookupView && view.searchInput) {
          setTimeout(() => view.searchInput.focus(), 100);
        }
      }
    });
    
    this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor) => {
      const selected = editor.getSelection().trim();
      if (selected) {
        menu.addItem(item => item.setTitle(t("add_word_title")).setIcon("plus").onClick(() => new WordModal(this.app, this, { word: selected }).open()));
      }

      // 查词功能（如果选中文本）
      if (selected) {
        // ★ 截断显示：超过20个字符截断并加 …
        const displayText = selected.length > 20 ? selected.slice(0, 20) + '…' : selected;
        const submenu = menu.addItem(item => {
          item.setTitle(t("editor_menu_lookup", displayText)).setIcon("search-code");
          // 子菜单
          const sub = item.setSubmenu();
          // 添加“默认”选项
          sub.addItem(subItem => {
            subItem.setTitle(t("lookup_default_prompt_option")).onClick(() => {
              this.openLookupWithWord(selected, "默认");
            });
          });
          // 添加自定义提示词
          const customs = this.settings.customPrompts || [];
          for (const p of customs) {
            sub.addItem(subItem => {
              subItem.setTitle(p.name).onClick(() => {
                this.openLookupWithWord(selected, p.name);
              });
            });
          }
        });
      }
    }));
    
    this.highlighter.registerPostProcessor();
    this.highlighter.registerEditorExtension();
    this.pdfObserver = this.highlighter.observePDFLayers();
    this.register(() => { if (this.pdfObserver) this.pdfObserver.disconnect(); });
    
    this.addSettingTab(new WordbookSettingTab(this.app, this));
    
    this.app.workspace.onLayoutReady(async () => {
      await this.reloadAllCards(false);
      await this.highlighter.refresh();
      this.app.workspace.trigger("simple-wordbook:data-updated");
    });
    
    this.registerEvent(this.app.vault.on("modify", async (file) => {
      if (file instanceof TFile && file.extension === "json") {
        const isWordbook = this.settings.wordbookFiles.some(wb => wb.path === file.path);
        if (isWordbook) {
          await this.reloadAllCards(false);
          await this.highlighter.refresh();
          this.app.workspace.trigger("simple-wordbook:data-updated");
          new Notice(t("wordbook_refreshed"));
        }
      }
    }));

    // ===== 注册自定义提示词命令 =====
    this.registerPromptCommands();
  }
  
  async onunload() {
    if (this.highlighter) {
      this.highlighter.cleanupPDFListeners?.();
    }
    // ===== 注销所有动态提示词命令 =====
    for (const id of this.dynamicCommandIds) {
      this.removeCommand(id);
    }
    this.dynamicCommandIds = [];
  }

  // 调用 AI API
  async callAI(prompt) {
    const settings = this.settings;
    const url = settings.apiBaseUrl;
    const apiKey = settings.apiKey;
    const model = settings.apiModel;

    // 参数校验
    if (!url || !apiKey) {
      throw new Error(t("api_error_config"));
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };

    const body = {
      model: model,
      messages: [
        { role: "system", content: "You are a dictionary assistant. Answer accurately and concisely." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1500
    };

    let response;
    try {
      // ★★★ 将 fetch 放在 try-catch 中，单独捕获网络层错误 ★★★
      response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });
    } catch (networkError) {
      // ★★★ 网络层错误（DNS 解析失败、连接拒绝、超时等） ★★★
      console.error("Network error:", networkError);
      throw new Error(t("api_error_network"));
    }

    // ★★★ HTTP 状态错误单独处理，显示状态码 ★★★
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = "";
      }
      // ★ 支持参数插值
      throw new Error(t("api_error_http", response.status, errorText));
    }

    // ★★★ 解析响应数据，增加更详细的错误提示 ★★★
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Parse error:", parseError);
      throw new Error(t("api_error_parse"));
    }

    // 兼容多种返回格式
    let content = data.choices?.[0]?.message?.content || data.content || data.response || "";
    if (!content) {
      console.warn("Unexpected API response format:", data);
      throw new Error(t("api_error_unexpected"));
    }
    return content;
  }

  // 获取查词面板叶子
  getLookupLeaf() {
    // 先查找是否已有查词面板叶子
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE_LOOKUP);
    if (existing.length > 0) {
      return existing[0];
    }

    // 在左侧边栏创建新叶子
    let leaf = this.app.workspace.getLeftLeaf(false);
    if (leaf) {
      leaf.setViewState({ type: VIEW_TYPE_LOOKUP, active: true });
      return leaf;
    }

    // 如果左侧边栏不可用，尝试右侧（但尽量用左侧）
    leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      leaf.setViewState({ type: VIEW_TYPE_LOOKUP, active: true });
      return leaf;
    }

    // 最后回退到创建新标签页（一般不会到这里）
    leaf = this.app.workspace.getLeaf('tab');
    leaf.setViewState({ type: VIEW_TYPE_LOOKUP, active: true });
    return leaf;
  }

  // 打开面板并查询
  async openLookupWithWord(word, promptName = null) {
    const leaf = this.getLookupLeaf();
    this.app.workspace.revealLeaf(leaf);
    const view = leaf.view;
    if (view instanceof LookupView) {
      if (promptName) {
        this.settings.selectedPrompt = promptName;
        await this.saveSettings();
        view.refreshPromptSelect();
      }
      view.currentWord = word;
      // 如果视图已渲染，直接查询
      if (view.searchInput) {
        view.searchInput.value = word;
        await view.doAILookup(word);  // 右键查词始终走 AI
      }
      // 否则 onOpen 会处理 currentWord
    }
  }

  // ---- 路径范围辅助（与 Highlighter 保持一致） ----
  isPathInScope(filePath) {
    if (!filePath) return false;
    const { scopeMode, scopePaths } = this.settings;
    if (!scopePaths || scopePaths.length === 0) return true;
    const normalizedPath = normalizePath(filePath).toLowerCase();
    const matches = scopePaths.some(p => {
      let normalizedP = normalizePath(p).toLowerCase();
      if (!normalizedP.endsWith('/')) {
        const abstractFile = this.app.vault.getAbstractFileByPath(p);
        if (abstractFile instanceof TFolder) {
          normalizedP += '/';
        }
      }
      if (normalizedP.endsWith('/')) {
        return normalizedPath.startsWith(normalizedP);
      } else {
        return normalizedPath === normalizedP;
      }
    });
    return scopeMode === "include" ? matches : !matches;
  }

  async activateSidebar() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_SIDEBAR)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_SIDEBAR, active: true });
    }
    workspace.revealLeaf(leaf);
  }
  
  async reloadAllCards(cleanupMissing = false) {
    const cards = [];
    let needSave = false;
    const validFiles = [];
    for (const dict of this.settings.wordbookFiles) {
      const file = this.app.vault.getAbstractFileByPath(dict.path);
      if (!file || !(file instanceof TFile)) {
        if (cleanupMissing) {
          needSave = true;
          continue;
        } else {
          validFiles.push(dict);
          continue;
        }
      }
      validFiles.push(dict);
      if (!dict.enabled) continue;
      const parsed = await WordbookParser.parseFile(this.app, dict.path);
      for (const card of parsed) {
        card.sourceFile = dict.path;
        cards.push(card);
      }
    }
    if (needSave && cleanupMissing) {
      this.settings.wordbookFiles = validFiles;
      await this.saveSettings();
    } else if (!cleanupMissing) {
      this.settings.wordbookFiles = validFiles;
    }
    this.allCardsCache = cards;
    this.buildSidebarTrie();
  }
  
  buildSidebarTrie() {
    this.sidebarTrie.clear();
    const allCards = this.getAllCards();
    for (const card of allCards) {
      this.sidebarTrie.addWord(card.word, card);
      if (card.aliases) {
        for (const alias of card.aliases) {
          if (alias) this.sidebarTrie.addWord(alias, card);
        }
      }
    }
  }

  // 只重新排列卡片顺序，不重新解析文件（用于拖拽排序后更新优先级）
  reorderCards() {
    const files = this.settings.wordbookFiles.map(f => f.path);
    const oldCards = this.allCardsCache || [];
    const newCards = [];
    const added = new Set();

    // 按新文件顺序遍历
    for (const path of files) {
      for (const card of oldCards) {
        // 使用 card 对象本身作为去重标识，而非字符串，避免不同词源同名单词被误去重
        if (card.sourceFile === path && !added.has(card)) {
          newCards.push(card);
          added.add(card);
        }
      }
    }
    // 如果某些卡片来源文件不在 wordbookFiles 中（极少情况），追加到末尾
    for (const card of oldCards) {
      if (!added.has(card)) {
        newCards.push(card);
        added.add(card);
      }
    }

    this.allCardsCache = newCards;
    this.buildSidebarTrie();
  }
  
  getAllCards() { return this.allCardsCache || []; }

  // ===== 注册自定义提示词命令 =====
  registerPromptCommands() {
    // 1. 注销所有已注册的动态命令
    for (const id of this.dynamicCommandIds) {
      this.removeCommand(id);
    }
    this.dynamicCommandIds = [];

    // 2. 获取所有提示词：默认 + 自定义
    const prompts = ['默认', ...this.settings.customPrompts.map(p => p.name)];

    // 3. 为每个提示词注册命令
    for (const promptName of prompts) {
      const id = `lookup-prompt-${promptName}`;
      const name = t("command_lookup_prompt", promptName);

      this.addCommand({
        id: id,
        name: name,
        callback: () => {
          const editor = this.app.workspace.activeEditor?.editor;
          if (!editor) {
            new Notice(t("notice_open_editor"));
            return;
          }
          const selected = editor.getSelection().trim();
          if (!selected) {
            new Notice(t("notice_select_word"));
            return;
          }
          this.openLookupWithWord(selected, promptName);
        }
      });

      this.dynamicCommandIds.push(id);
    }
  }

  // ===== 打开快捷键设置并过滤本插件命令 =====
  async openHotkeysSettings() {
    // 打开设置面板
    await this.app.setting.open();
    // 切换到快捷键标签页
    await this.app.setting.openTabById('hotkeys');

    // 定义搜索框查找函数
    const findSearchInput = () => {
      // 尝试多种选择器
      const selectors = [
        'input[type="search"]',
        '.setting-search-input input[type="search"]',
        '.search-input-container input[type="search"]',
        '.setting-hotkeys-search input[type="search"]'
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el;
      }
      return null;
    };

    // 重试机制：延迟执行，最多尝试 5 次，每次间隔 200ms
    let attempts = 0;
    const maxAttempts = 5;

    const tryFill = () => {
      attempts++;
      const searchInput = findSearchInput();
      if (searchInput) {
        // 聚焦输入框
        searchInput.focus();
        // 设置值
        searchInput.value = this.manifest.id; // 例如 'simple-wordbook'
        // 触发多种事件以模拟真实输入
        searchInput.dispatchEvent(new Event('focus', { bubbles: true }));
        searchInput.dispatchEvent(new Event('keydown', { bubbles: true }));
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('keyup', { bubbles: true }));
        searchInput.dispatchEvent(new Event('change', { bubbles: true }));
        // 确保输入框保持聚焦（可选）
        searchInput.blur();
        searchInput.focus();
      } else if (attempts < maxAttempts) {
        // 如果未找到且未超过尝试次数，继续尝试
        setTimeout(tryFill, 200);
      } else {
        console.warn('Simple Wordbook: 未找到快捷键搜索框');
      }
    };

    // 首次尝试：等待 300ms 后执行
    setTimeout(tryFill, 300);
  }

  async loadSettings() { 
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    if (!this.settings.highlightStyles) this.settings.highlightStyles = { underlineType: "none", bold: false };
    if (this.settings.highlightStyles.underlineType === undefined) this.settings.highlightStyles.underlineType = "none";
    if (this.settings.highlightStyles.bold === undefined) this.settings.highlightStyles.bold = false;
    if (this.settings.followCardColor === undefined) this.settings.followCardColor = true;
    if (this.settings.underlineColor === undefined) this.settings.underlineColor = "";
    if (this.settings.highlightColor === undefined) this.settings.highlightColor = "";
    if (this.settings.wordbookFiles) {
      for (const file of this.settings.wordbookFiles) {
        if (file.readonly === undefined) file.readonly = false;
      }
    }
    if (this.settings.enableHighlightScopeFilter === undefined) this.settings.enableHighlightScopeFilter = false;
    if (this.settings.enableSidebarScopeFilter === undefined) this.settings.enableSidebarScopeFilter = false;
    if (this.settings.scopeMode === undefined) this.settings.scopeMode = "include";
    if (this.settings.scopePaths === undefined) this.settings.scopePaths = [];
  }
  async saveSettings() { await this.saveData(this.settings); }

  async focusWordInSidebar(cardData, preferredSource = null) {
    await this.activateSidebar();
    await new Promise(resolve => setTimeout(resolve, 100));
    const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_SIDEBAR)[0];
    const view = leaf?.view;
    if (view instanceof SidebarView) {
      await view.focusWord(cardData, preferredSource);
    } else {
      new Notice(t("notice_sidebar_not_ready"));
    }
  }
}

module.exports = SimpleWordbookPlugin;