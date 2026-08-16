const { Plugin, ItemView, Notice, MarkdownRenderer, TFile, TFolder, Modal, Setting, FuzzySuggestModal, setIcon, normalizePath, PluginSettingTab, editorInfoField, SecretComponent, Menu } = require('obsidian');
const { EditorView, Decoration } = require('@codemirror/view');
const { StateField, RangeSetBuilder, StateEffect } = require('@codemirror/state');

const VIEW_TYPE_SIDEBAR = "simple-wordbook-sidebar";
const VIEW_TYPE_LOOKUP = "simple-wordbook-lookup";
const VIEW_TYPE_LIBRARY = "simple-wordbook-library";
const VIEW_TYPE_STUDY = "simple-wordbook-study";

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
    definition_placeholder: "**Definition**\ntake (verb): to get hold of, to use, to require\n\n---\n**Examples**\nI take the bus to work every day.\nIt takes me 30 minutes to get there.\n\n---\n**Phrases**\ntake care of\ntake place\ntake part in",
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
    color_none: "None",
    color_custom: "Custom",
    save: "Save",
    cancel: "Cancel",
    word_required: "Word is required",
    select_wordbook: "Select a wordbook file",
    word_saved: "Word {0}",
    word_added: "added",
    word_updated: "updated",
    save_failed: "Failed to save",
    settings_wordbook_files: "Wordbook Files",
    settings_new_wordbook: "New Wordbook",
    settings_add_wordbook: "Add Wordbook",
    settings_add_wordbook_desc: "Add an existing .json wordbook file or create a new one.",
    settings_new_wordbook_folder: "Folder",
    settings_new_wordbook_select_folder: "Select Folder",
    settings_new_wordbook_root: "Root (Vault root)",
    settings_new_wordbook_file_name: "File Name",
    settings_new_wordbook_file_name_desc: "Enter the name (without .json extension)",
    settings_new_wordbook_placeholder: "my_wordbook",
    settings_new_wordbook_enter_name: "Please enter a file name.",
    settings_new_wordbook_file_exists: 'File "{0}" already exists.',
    settings_new_wordbook_created: 'Wordbook "{0}" created and added.',
    settings_new_wordbook_failed: "Failed to create wordbook: {0}",
    settings_new_wordbook_selected: "Selected:",
    file_not_found: "⚠️ File not found: {0}",
    rename_success: 'Wordbook path updated: "{0}"',
    relocate_tooltip: "Relocate",
    relocate_success: 'Wordbook relocated to "{0}"',
    remove_tooltip: "Remove",
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
    import_title: "Import",
    import_mastered: "Import Mastered",
    import_ignored: "Import Ignored",
    import_button: "Import",
    import_no_files: "No TXT files found in your vault.",
    import_no_words: "No valid words found in the TXT file.",
    import_success: "Successfully imported {0} words to {1}.",
    import_no_new: "No new words to import.",
    import_mastered_desc: "Import words to mark as 'Mastered'. Supports .txt files only, one word or phrase per line, or separated by `,` `;` `Tab` etc.",
    import_ignored_desc: "Import words to mark as 'Ignored'. Supports .txt files only, one word or phrase per line, or separated by `,` `;` `Tab` etc.",

    export_title: "Export",
    export_name: "Export Wordbook",
    export_desc: "Export wordbook as Markdown (.md), Anki-compatible TXT (.tsv), etc.",
    export_button: "Export",
    export_modal_title: "Export Wordbook",
    export_select_wordbooks: "Select Wordbooks",
    export_select_hint: "Only enabled wordbooks shown, multi-select allowed",
    export_range: "Export Range",
    export_range_all: "All",
    export_range_learning: "Learning",
    export_range_mastered: "Mastered",
    export_range_ignored: "Ignored",
    export_range_hint: "Status determined by current mastery/ignore mode",
    export_format: "Export Format",
    export_format_markdown: "Markdown (.md) — For reading/printing",
    export_format_anki: "TXT (Anki-compatible) — Tab-separated TSV",
    export_options: "Export Options",
    export_include_phonetic: "Include Phonetic",
    export_include_aliases: "Include Aliases",
    export_include_definition: "Include Definition",
    export_include_source: "Include Source",
    export_include_status: "Include Status",
    export_include_lang: "Include Pronunciation Language (lang) field",
    export_phonetic_label: "Phonetic:",
    export_aliases_label: "Aliases:",
    export_source_label: "Source:",
    export_status_label: "Status:",
    export_lang_label: "Language:",
    export_convert_html: "Convert to HTML (TXT only, recommended)",
    export_convert_hint: "Convert Markdown bold and line breaks to Anki-compatible HTML tags (<b> and <br>)",
    export_one_line_per_word: "One word per line (no quotes, convert line breaks to spaces)",
    export_save_location: "Save Location:",
    export_select_folder: "Select Folder",
    export_filename: "Filename:",
    export_success: "Exported successfully to {0}",
    export_no_wordbook: "Please select at least one wordbook",
    export_no_word: "No words match the selected range",
    export_overwrite_confirm: "File already exists. Overwrite?",
    export_status_learning: "Learning",
    export_status_mastered: "Mastered",
    export_status_ignored: "Ignored",
    export_mastered: "Export Mastered",
    export_ignored: "Export Ignored",
    export_mastered_desc: "Export all mastered words as TXT, one per line",
    export_ignored_desc: "Export all ignored words as TXT, one per line",
    export_simple_success: "Exported {0} words to {1}",
    export_simple_no_words: "No {0} words found",
    export_simple_file_exist: "File already exists, overwrite?",
    export_mastered_file_name: "mastered_words.txt",
    export_ignored_file_name: "ignored_words.txt",
    export_export: "Export",
    export_single_card: "Export as Markdown",
    export_enter_filename: "Please enter a file name.",
    export_failed: "Export failed, please check console for errors.",

    plugin_language: "Plugin Language",
    plugin_language_desc: "Choose the display language for the plugin. 'Auto' will automatically sync with Obsidian's interface language.",
    language_follow_obsidian: "Auto",
    settings_highlight_preview: "Highlight & Preview",
    settings_enable_highlight: "Enable auto highlight",
    settings_highlight_color: "Highlight color",
    settings_highlight_color_desc: "Highlight color. 'Default' uses theme accent.",
    color_default_desc: "Default (theme accent)",
    color_custom_picker_tooltip: "Custom: Click to pick color",
    settings_follow_card: "Follow card color",
    settings_follow_card_desc: "When ON, background highlight follows card color.",
    settings_enable_text_highlight: "Text Color Highlight",
    settings_enable_text_highlight_desc: "When enabled, uses text color instead of background color for highlights. Only applies to Markdown files; PDFs will still use background highlighting.",
    settings_md_opacity: "Markdown Highlight Opacity",
    settings_md_opacity_desc: "Control the opacity of highlight background in Markdown files (default: 30%)",
    settings_pdf_opacity: "PDF Highlight Opacity",
    settings_pdf_opacity_desc: "Control the opacity of highlight background in PDF files (default: 70%)",
    settings_underline_color: "Underline color",
    settings_underline_color_desc: "If set, underlines use this color (overrides highlight color).",
    underline_color_default: "Default (follow highlight color)",
    settings_enable_hover: "Enable hover preview",
    settings_blur_definitions: "Enable blur definitions",
    settings_blur_desc: "Blur definition content, reveal on hover",
    settings_enable_fold: "Enable Fold Definition",
    settings_enable_fold_desc: "Collapse definition area by default on word cards. Click the ▶ button to expand.",
    settings_enable_mastery: "Enable Mastery/Ignore Buttons",
    settings_enable_mastery_desc: "Show or hide mastery (😊/😐) and ignore (👁️/👁️‍🗨️) buttons on word cards in sidebar and lookup panel.",
    settings_highlight_styles: "Highlight styles",
    settings_style_underline_type: "Underline style",
    settings_style_none: "None",
    settings_style_solid: "Solid underline",
    settings_style_dashed: "Dashed underline",
    settings_style_dotted: "Dotted underline",
    settings_style_wavy: "Wavy underline",
    settings_style_double: "Double underline",
    settings_style_bold: "Bold",
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
    settings_scope_mode_desc: "If the highlight scope includes wordbook files, matching words in the corresponding card will also be highlighted.",
    settings_scope_mode_include: "Include only these paths",
    settings_scope_mode_exclude: "Exclude these paths",
    settings_scope_paths: "Path List",
    settings_scope_paths_desc: "One path per line. Markdown files must include the '.md' extension. Use '*' to match all files in the vault root (not subfolders).",
    scope_paths_placeholder: "Folder/note.md\nFolder",
    settings_tab_files: "Files",
    settings_tab_general: "General",
    command_open_settings: "Open Settings",

    settings_tab_tts: "TTS",
    tts_pronunciation_general: "General Pronunciation Settings",
    tts_default_lang_label: "Default Pronunciation Language",
    tts_default_lang_desc: "Used when the word has no 'lang' field",
    language_current_detail: "Current Language Details",
    language_display_name: "Display Name",
    language_standard_code: "Standard Code",
    language_code_desc: "Select from built-in languages, or manually enter a BCP 47 standard code.",
    preset_google: "Google",
    preset_baidu: "Baidu",
    preset_system: "System",
    preset_custom: "Custom",
    language_preset_codes: "Custom Codes for Presets",
    language_reset_default: "Reset to default",
    language_add: "Add Language",
    language_deleted: "Language deleted",
    language_updated: "Language updated",
    language_added: "Language added",
    language_delete_confirm: "Are you sure you want to delete this language?",
    language_delete_confirm_with_count: "This language is used by {0} words, are you sure to delete?",
    language_cannot_delete_en: "Cannot delete the fallback language 'en'.",
    language_fill_required: "Please fill in all required fields",
    language_code_exists: "Standard code already exists",
    language_edit_title: "Add/Edit Language",
    tts_network_tts_title: "Network TTS",
    settings_tts_template: "TTS URL template",
    tts_template_desc: "Use {{word}}, {{type}}, {{accent}}, {{lang}}, {{rate}} placeholders",
    settings_variant: "Pronunciation variant",
    tts_preset_label: "TTS Preset",
    tts_preset_desc: "Quick switch between built-in TTS services, auto-fills the template below",
    tts_preset_custom: "Custom",
    tts_preset_youdao: "Youdao (English only)",
    tts_preset_baidu: "Baidu (Multi-language)",
    tts_preset_google: "Google (Multi-language)",
    tts_variant_desc: "US/UK pronunciation, only effective for templates using {{type}} (e.g., Youdao)",
    tts_speech_rate_label: "Speech Rate",
    tts_speech_rate_desc: "Adjust speaking speed",
    tts_speech_rate_reset: "Reset to Default",
    tts_speech_rate_reset_tooltip: "Restore default values for the current preset",
    tts_speech_rate_min: "Min",
    tts_speech_rate_max: "Max",
    tts_speech_rate_current: "Current rate: {0}",
    tts_test_label: "Pronunciation Test",
    tts_test_desc: "Enter a word to test the current network TTS configuration",
    tts_test_play: "Play",
    word_lang_label: "Pronunciation Language (lang)",
    word_lang_desc: "Select the language for this word. Default follows the \"Default Pronunciation Language\" setting.",
    notice_tts_playback_failed: "TTS playback failed, please check your network or switch to another preset.",
    tts_system_tts_title: "System TTS",
    tts_system_tts_enable: "Enable System TTS",
    tts_system_tts_desc: "Use the browser/OS built-in speech synthesis engine, completely offline, multi-language support. When enabled, \"system TTS\" will be used first; if unavailable, it will automatically fall back to \"Network TTS\".",
    tts_system_voice_label: "Voice",
    tts_system_voice_loading: "Loading system voices...",
    tts_system_voice_no_voices: "No voices available",
    tts_system_voice_default: "Default",
    tts_system_voice_desc: "With 'Default', the system will match the voice based on the word's 'lang' field; if not set, it falls back to the 'Default Pronunciation Language'. If still no match, a notification will be shown indicating the missing voice pack. Choosing a specific voice will force it to be used for all words.",
    tts_system_voice_test: "Test",
    tts_system_test_text: "Hello, this is a test voice.",
    tts_system_rate_label: "Speech Rate",
    tts_system_rate_desc: "Adjust the speaking speed. Default 1.0, range 0.5–2.0.",
    tts_system_pitch_label: "Pitch",
    tts_system_pitch_desc: "Adjust the pitch. Default 1.0, range 0.5–2.0.",
    tts_system_hint: "📢 Uses the operating system's built-in voice engine, fully offline. If pronunciation is abnormal, please check your system's voice settings.",
    tts_system_fallback_notice: "No {lang} voice available. Please switch back to online TTS or change system voice.",
    tts_system_auto_switched: "Automatically switched to {voice} to support the current language.",
    tts_system_no_voice_for_lang: "No system voice available for {lang}. Please install the language pack or disable System TTS.",
    command_pronounce_selected: "Speak selected text",
    tts_test_enter_word: "Please enter a word to test.",

    settings_tab_ai: "AI",
    settings_api_config: "API Configuration",
    settings_ai_provider: "Service Provider",
    settings_ai_provider_desc: "Select a preset provider or choose Custom",
    settings_ai_api_url: "API URL",
    settings_ai_api_key: "API Key",
    settings_ai_model: "Model Name",
    provider_openai: "OpenAI",
    provider_deepseek: "DeepSeek",
    provider_glm: "GLM (Zhipu)",
    provider_tongyi: "Tongyi Qianwen",
    provider_ollama: "Ollama (Local)",
    provider_custom: "Custom",
    api_url_placeholder_custom: "Enter API URL",
    api_url_placeholder_preset: "Auto-filled",
    api_key_placeholder: "Enter API Key",
    api_model_placeholder: "Model name",
    settings_prompts: "Prompts",
    settings_system_prompts: "System Prompts",
    settings_system_prompt_desc: "Set AI's persona (style/format of AI responses)",
    settings_builtin_prompts: "Built-in System Prompts",
    settings_builtin_desc: "Select a preset below to preview its content, then copy it to create a custom version.",
    settings_select_builtin: "Select built-in style",
    settings_copy_content: "📋 Copy Content",
    settings_copied: "Copied to clipboard!",
    settings_copy_empty: "No content to copy.",
    builtin_label: "Built-in",
    settings_system_prompt_name: "Name",
    settings_system_prompt_content: "System Prompt Content",
    settings_add_system_prompt: "Add System Prompt",
    settings_default_system_prompt: "System Prompt for Default Prompt",
    settings_default_system_prompt_desc: "Select the system prompt associated with this prompt, 'None' means no system instruction",
    settings_system_prompt_none: "None",
    settings_system_prompt_duplicate: "Name already exists",
    settings_system_prompt_empty: "Name and content cannot be empty",
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
    lookup_enter_mode_desc: "Choose what happens when pressing Enter in the search box.\nShift+Enter defaults to AI lookup",
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
    notice_ignored_label_on: "Unignore",
    notice_ignored_label_off: "Mark as Ignored",
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
    section_default_title: "Definition",
    section_content_prefix: "Content",

    settings_api_key_mode: "API Key Storage Mode",
    settings_api_key_mode_secret: "Official Keychain",
    settings_api_key_mode_local: "Local Encrypted",
    settings_api_key_verifying: "⏳ Verifying...",
    settings_api_key_status_missing: "⚠️ Key not found in keychain, associated: {0}",
    settings_api_key_status_corrupted: "⚠️ Current key data corrupted or unreadable, please re-enter the key",
    settings_api_key_status_error: "⚠️ Verification failed",
    settings_api_key_status_associated: "Associated: {0}",
    settings_api_key_status_not_selected: "No key selected",
    settings_api_key_status_encrypted: "Encrypted",
    settings_api_key_status_not_set: "Not set",
    settings_api_key_migrate_title: 'Switch to "{0}" mode',
    settings_api_key_migrate_desc: "Valid key detected in current mode. Migrate to new mode?",
    settings_api_key_migrate_skip: "Skip (switch only)",
    settings_api_key_migrate_confirm: "Migrate Key",
    settings_api_key_new_name: "Key Name",
    settings_api_key_new_name_desc: "Identifier for this key in the keychain",
    notice_api_migrated: "🔒 API Key automatically encrypted (Vault-specific)",
    notice_api_switch_mode: 'Switched to "{0}" mode',
    notice_api_saved_encrypted: "✅ API Key saved encrypted",
    notice_api_migrate_fail: "Migration to keychain failed: {0}",
    notice_secret_storage_unavailable: "⚠️ Official Keychain is not available in this Obsidian version. Switched to Local Encrypted mode.",

    example_fetch_btn: "Fetch example from current document",
    example_picker_title: "Select / Edit Example",
    example_picker_desc: "The content containing the current word has been auto-detected. You can edit it below, then click 'Confirm' to insert it into the definition.",
    example_picker_confirm: "Insert Example",
    example_appended: "✅ Added to '{0}' section",
    example_no_sentence: "No content detected. Please enter manually or reposition the cursor.",
    example_edit_only: "This feature is only available in edit mode",
    example_extract_mode: "Extract mode:",
    example_extract_mode_desc: "Switching mode will overwrite the current content.",
    example_mode_paragraph: "By empty line",
    example_mode_line: "By line break",
    example_mode_sentence: "By sentence boundary",
    example_mode_list: "By list item",
    example_mode_paragraph_desc: "Extract the complete paragraph where the cursor is located, using empty lines as boundaries.",
    example_mode_line_desc: "Extract the current line where the cursor is located, using line breaks as boundaries.",
    example_mode_sentence_desc: "Intelligently detect sentence boundaries (。！？.!?) and extract the sentence where the cursor is located.",
    example_mode_list_desc: "Detect list markers (-, *, numbers.) and extract the list item where the cursor is located.",
    example_section_title: "Examples",
    example_section_title_label: "Section Title",
    example_no_content: "No content extracted, please enter manually.",

    library_view_title: "Library",
    library_search_placeholder: "Search words or aliases...",
    library_filter_color_all: "All colors",
    library_filter_color_default: "Default",
    library_filter_status_all: "All status",
    library_filter_status_learning: "Learning",
    library_filter_status_mastered: "Mastered",
    library_filter_status_ignored: "Ignored",
    library_filter_source_all: "All sources",
    library_sort_field_word: "Word",
    library_sort_field_status: "Status",
    library_sort_field_color: "Color",
    library_sort_field_source: "Source",
    library_sort_toggle: "Toggle sort direction",
    library_select_all_title: "Select/Deselect all visible",
    library_batch_selected: "Selected {0} items",
    library_batch_color: "Change color",
    library_batch_mastered: "Mark Mastered",
    library_batch_unmaster: "Unmark Mastered",
    library_batch_ignore: "Mark Ignored",
    library_batch_unignore: "Unmark Ignored",
    library_batch_delete: "Delete Selected",
    library_batch_clear: "Clear Selection",
    library_stats_total: "Total: {0}",
    library_stats_mastered: "Mastered: {0} ({1}%)",
    library_stats_learning: "Learning: {0} ({1}%)",
    library_stats_ignored: "Ignored: {0} ({1}%)",
    library_table_header_select: "Select",
    library_table_header_word: "Word",
    library_table_header_phonetic: "Phonetic",
    library_table_header_definition: "Definition",
    library_table_header_source: "Source",
    library_table_header_color: "Color",
    library_table_header_status: "Status",
    library_empty: "No matching words.",
    library_status_mastered: "Mastered",
    library_status_learning: "Learning",
    library_status_ignored: "Ignored",
    library_confirm_delete_batch: "Delete selected {0} words?",
    library_batch_delete_success: "Deleted {0} words.",
    library_batch_color_success: "Color updated for {0} words.",
    library_batch_mastered_success: "Marked mastered for {0} words.",
    library_batch_ignored_success: "Marked ignored for {0} words.",
    library_batch_unmaster_success: "Unmarked mastered for {0} words.",
    library_batch_unignored_success: "Unmarked ignored for {0} words.",
    command_open_library: "Open Library",
    ribbon_library_tooltip: "Library",
    library_copy_word: "Copy Word",
    library_copy_phonetic: "Copy Phonetic",
    library_copy_definition: "Copy Definition",
    library_copy_source: "Copy Source Path",
    library_copy_all: "Copy All Info",
    copy_all_word: "Word:",
    copy_all_phonetic: "Phonetic:",
    copy_all_source: "Source:",
    copy_all_definition: "Definition:",
    library_batch_delete_success: "All {0} words deleted successfully.",
    library_batch_delete_failed: "Deleted {0} words, {1} failed: {2}",
    library_batch_delete_and_more: "... and {0} more",
    library_batch_delete_see_console: "Check console for details.",

    study_view_title: "Study Center",
    study_ribbon_tooltip: "Study Center",
    study_command_open: "Open Study Center",
    study_today_goal: "Today: {0}/{1}",
    study_stats_total: "Total",
    study_stats_learning_rate: "Learning Rate",
    study_stats_mastered_rate: "Mastered Rate",
    study_stats_ignored_rate: "Ignored Rate",
    study_stats_today_progress: "Today's Progress",
    study_stats_streak: "Day Streak",
    study_stats_streak_days: "{0} days",
    study_tab_review: "📖 Review",
    study_tab_mastered: "✅ Mastered",
    study_tab_stats: "📊 Stats",
    study_tab_settings: "⚙️ Settings",
    study_review_motivation: "Today {0} due, {1} words this round, go go go!",
    study_review_empty: "No words due for review today! 🎉",
    study_review_done: "Review complete! {0} words this round, {1} words total today.",
    study_review_progress: "Word {0}/{1} · Level {2} · Next in {3} days",
    study_card_hint: "Double-click or press Space to reveal",
    study_btn_forget: "😣 Forget",
    study_btn_remember: "😊 Remember",
    study_btn_start: "Let's do this! 💪",
    study_btn_again: "One more round",
    study_btn_back: "Back to start",
    study_mastered_list_empty: "No mastered words yet.",
    study_stats_retention: "Retention Rate",
    study_stats_learning_distribution: "Learning Distribution",
    study_stats_trend: "Learning Trend (30 days)",
    study_stats_level_distribution: "Level Distribution",
    study_stats_source_distribution: "Source Distribution",
    study_stats_color_distribution: "Color Distribution",
    study_settings_title: "Study Settings",
    study_settings_daily_goal: "Daily Goal",
    study_settings_daily_goal_desc: "Number of words to review per day",
    study_settings_daily_limit: "Daily Review Limit",
    study_settings_daily_limit_desc: "Maximum words per review session",
    study_settings_review_order: "Review Order",
    study_settings_review_order_desc: "Controls the sorting order of all words in the due review queue",
    study_settings_review_order_due: "Due First",
    study_settings_review_order_high_level: "High Level First",
    study_settings_review_order_low_level: "Low Level First",
    study_settings_flashcard_phonetic: "Show Phonetic",
    study_settings_flashcard_phonetic_desc: "Show phonetic transcription on the card",
    study_settings_flashcard_autoflip: "Auto Flip (seconds)",
    study_settings_flashcard_autoflip_desc: "Automatically flip after seconds (0=disabled)",
    study_reset_progress: "Reset All Review Progress",
    study_reset_desc: "Reset all review progress and statistics. This action cannot be undone.",
    study_reset_confirm: "Are you sure you want to reset all review progress? This will clear all review records and statistics.",
    study_reset_success: "Review progress reset.",
    study_btn_exit: "Exit Review",
    study_btn_prev: "Prev",
    study_btn_next: "Next",
    study_shortcut_hint: "← Forget ｜ Remember →",
    study_shortcut_hint_4btn: "← Forget ｜ Good →\n↑ Easy ｜ Hard ↓",
    study_tab_levels: "📈 Levels",
    study_level_all: "All levels",
    study_level_label: "Level {0}",
    study_no_words_for_level: "No words for this level.",
    trend_today_label: "📌 Today: {0} words",
    trend_summary_label: "📊 Total {0} · Avg {1} · Peak {2}",
    study_table_header_level: "Level",
    study_table_header_actions: "Actions",
    study_level_search_placeholder: "Search words...",
    study_level_search_empty: "No words found for \"{0}\"",
    study_goal_cannot_exceed_limit: "Daily goal cannot exceed review limit ({0}).",
    study_goal_adjusted_to_limit: "Daily goal adjusted to match review limit ({0}).",
    study_settings_flashcard_tabs: "Show Tabs for Definition",
    study_settings_flashcard_tabs_desc: "Display multiple definition sections as tabs on the review card, press number keys 1-9 to switch.",
    study_prep_wordbook: "Wordbook",
    study_prep_all: "All Wordbooks",
    study_prep_total: "Total",
    study_prep_mastered: "Mastered",
    study_prep_ignored: "Ignored",
    study_prep_learning: "Learning",
    study_prep_no_wordbooks: "No wordbooks enabled",
    study_prep_empty_book: "This wordbook is empty",
    study_prep_all_mastered: "No words to review!",
    study_level_list_empty: "No review records found.",
    study_settings_intervals: "Review Intervals (Level 0~4)",
    study_settings_intervals_desc: "Customize base review intervals (days) for levels 0~4. Actual interval = base × Ease Factor. Only affects future reviews.",
    study_intervals_reset: "Reset to Default",
    study_intervals_reset_notice: "Reset to default: 1, 2, 4, 8, 16 days",
    study_intervals_updated_notice: "Intervals updated, will take effect next review",
    study_btn_hard: "😐 Hard",
    study_btn_good: "🙂 Good",
    study_btn_easy: "😊 Easy",
    study_sort_level_asc: "Level ↑ (0→5)",
    study_sort_level_desc: "Level ↓ (5→0)",
    study_sort_diff_asc: "Ease Factor ↑",
    study_sort_diff_desc: "Ease Factor ↓",
    study_sort_review_asc: "Review Count ↑",
    study_sort_review_desc: "Review Count ↓",
    library_table_header_difficulty: "Ease Factor",
    study_table_header_review_count: "Reviews",
    settings_enable_fine_feedback: "Fine Feedback",
    settings_enable_fine_feedback_desc: "Show 4 feedback buttons (Forget/Hard/Good/Easy) on review cards",
    study_type_filter_all: "All Types",
    study_type_newbie: "🔵 Newbie",
    study_type_steady: "🟡 Steady",
    study_type_efficient: "🟢 Efficient",
    study_type_struggling: "🟠 Struggling",
    study_type_stubborn: "🔴 Stubborn",
    study_params_advanced: "Advanced Settings",
    study_params_baseDelta: "Base Ease Factor",
    study_params_extraDelta: "Extra Ease Factor + Reward Threshold",
    study_params_range: "Ease Factor Range",
    study_params_min: "Min:",
    study_params_max: "Max:",
    study_params_threshold: "Reward Threshold (count): ≥",
    study_params_suspend: "Suspend Parameters + Penalty Threshold",
    study_params_suspend_thresholds: "Penalty Threshold (count):",
    study_params_suspend_again: "Again Suspend (days):",
    study_params_suspend_hard: "Hard Suspend (days):",
    study_params_reset: "Reset to Default",
    study_params_reset_confirm: "Reset to default parameters?",
    study_params_reset_success: "✅ Reset to default params",
    study_params_help_title: "Parameter Description:",
    study_params_help_baseDelta: "Base Ease Factor: Change in ease factor after each review button click (negative = shorter interval, positive = longer interval).",
    study_params_help_extraDelta: "Extra Ease Factor: Extra bonus after {0} consecutive Good/Easy reviews.",
    study_params_help_suspend: "Suspend Parameters + Penalty Threshold: Suspend N days after X consecutive Again/Hard reviews.",
    study_params_help_threshold_note: "Threshold (count): Reward threshold is the consecutive count of Good/Easy clicks; Penalty threshold is the consecutive count of Again/Hard clicks.",
    study_params_apply_threshold_duplicate: "❌ Penalty thresholds cannot be duplicated",
    study_params_import_minmax: "❌ Ease factor min must be less than max",
    study_params_again: "Again:",
    study_params_hard: "Hard:",
    study_params_good: "Good:",
    study_params_easy: "Easy:",
    study_settings_new_word_order: "New Word Order",
    study_settings_new_word_order_desc: "Order to add new words from the wordbook when due words are insufficient.",
    study_new_word_order_sequential: "Sequential",
    study_new_word_order_random: "Random",

    github_link_text: `Click to visit <a href="https://github.com/Bin-T/obsidian-simple-wordbook" target="_blank" rel="noopener noreferrer" class="github-link" style="color: var(--text-accent); text-decoration: none;">GitHub</a> to download <a href="https://github.com/Bin-T/obsidian-simple-wordbook/tree/main/wordbooks" target="_blank" rel="noopener noreferrer" class="github-link" style="color: var(--text-accent); text-decoration: none;">Wordbooks</a>, give it a ⭐ if you like it`,

    builtin_prompt_default_name: "Default",
    builtin_prompt_default_content: "You are a dictionary assistant. Answer accurately and concisely. Respond in the same language as the user's query.",
    builtin_prompt_cute_name: "Cute & Soft",
    builtin_prompt_cute_content: "Cute and soft girl style, using short and playful words, suitable for beauty, pets, and lifestyle content. Tone is light and gentle, avoiding formal expressions. Respond in the same language as the user's query.",
    builtin_prompt_trendy_name: "Trendy & Cool",
    builtin_prompt_trendy_content: "Trendy internet style, using mild internet slang, understanding slang and translating it into easy-to-understand memes. Relaxed and casual, suitable for social platforms. Respond in the same language as the user's query.",
    builtin_prompt_daily_name: "Daily Colloquial",
    builtin_prompt_daily_content: "Everyday colloquial style, with short and easy-to-understand sentences, abandoning formal expressions, suitable for short video subtitles. Respond in the same language as the user's query.",
    builtin_prompt_business_name: "Business Formal",
    builtin_prompt_business_content: "Standard professional formal style, with rigorous and appropriate wording, standardized sentence patterns, suitable for business emails, reports, and corporate communications. Neutral and polite. Respond in the same language as the user's query.",
    builtin_prompt_academic_name: "Academic Solemn",
    builtin_prompt_academic_content: "Academic standard translation, meeting journal paper writing standards, with accurate and objective professional terms, logical rigor, third-person objective narration. Suitable for research reports and papers. Respond in the same language as the user's query.",
    builtin_prompt_literary_name: "Literary Aesthetic",
    builtin_prompt_literary_content: "Literary aesthetic translation, with prose style, preserving the original mood and emotion, using beautiful and picturesque wording, suitable for essays and lyrical copy. Respond in the same language as the user's query.",
  },
  zh: {
    sidebar_title: "侧边栏显示",
    tab_learning: "学习",
    tab_mastered: "掌握",
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
    color_none: "无",
    color_custom: "自定义",
    save: "保存",
    cancel: "取消",
    word_required: "请输入单词",
    select_wordbook: "请选择一个单词本文件",
    word_saved: "单词已{0}",
    word_added: "添加",
    word_updated: "更新",
    save_failed: "保存失败",
    settings_wordbook_files: "单词本文件",
    settings_new_wordbook: "新建单词本",
    settings_add_wordbook: "添加单词本",
    settings_add_wordbook_desc: "添加已有的 `.json` 单词本文件，或新建一个。",
    settings_new_wordbook_folder: "文件夹",
    settings_new_wordbook_select_folder: "选择文件夹",
    settings_new_wordbook_root: "根目录",
    settings_new_wordbook_file_name: "文件名",
    settings_new_wordbook_file_name_desc: "输入名称（不含 .json 后缀）",
    settings_new_wordbook_placeholder: "我的单词本",
    settings_new_wordbook_enter_name: "请输入文件名。",
    settings_new_wordbook_file_exists: '文件 "{0}" 已存在。',
    settings_new_wordbook_created: '单词本 "{0}" 已创建并添加。',
    settings_new_wordbook_failed: "创建单词本失败：{0}",
    settings_new_wordbook_selected: "已选择：",
    file_not_found: "⚠️ 文件未找到：{0}",
    rename_success: '单词本路径已更新为 "{0}"',
    relocate_tooltip: "重新定位",
    relocate_success: '单词本已重新定位到 "{0}"',
    remove_tooltip: "删除",
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
    import_title: "导入",
    import_mastered: "导入掌握",
    import_ignored: "导入忽略",
    import_button: "导入",
    import_no_files: "库中没有找到 TXT 文件。",
    import_no_words: "TXT 文件中没有找到有效单词。",
    import_success: "成功导入 {0} 个单词到 {1}。",
    import_no_new: "没有需要导入的新单词。",
    import_mastered_desc: "导入单词以标记为“掌握”。仅支持 .txt 文件，每行一个单词或词组，或用 `,` `，` `;` `；` `Tab` 等分隔。",
    import_ignored_desc: "导入单词以标记为“忽略”。仅支持 .txt 文件，每行一个单词或词组，或用 `,` `，` `;` `；` `Tab` 等分隔。",

    export_title: "导出",
    export_name: "导出单词本",
    export_desc: "将单词本导出为 Markdown (.md)、Anki 兼容的 TXT (.tsv) 等格式。",
    export_button: "导出",
    export_modal_title: "导出单词本",
    export_select_wordbooks: "选择单词本",
    export_select_hint: "仅显示已启用的词库，可多选",
    export_range: "导出范围",
    export_range_all: "全部",
    export_range_learning: "学习中",
    export_range_mastered: "掌握",
    export_range_ignored: "忽略",
    export_range_hint: "状态依据当前“掌握/忽略模式”判定",
    export_format: "导出格式",
    export_format_markdown: "Markdown (.md) — 适合阅读/打印",
    export_format_anki: "TXT (Anki 导入兼容) — 制表符分隔 TSV",
    export_options: "导出选项",
    export_include_phonetic: "包含音标",
    export_include_aliases: "包含别名",
    export_include_definition: "包含释义",
    export_include_source: "包含来源",
    export_include_status: "包含状态",
    export_include_lang: "包含发音语言（lang）字段",
    export_phonetic_label: "音标：",
    export_aliases_label: "别名：",
    export_source_label: "来源：",
    export_status_label: "状态：",
    export_lang_label: "语言：",
    export_convert_html: "转换为 HTML（仅 TXT 格式，推荐勾选）",
    export_convert_hint: "将 Markdown 粗体（**）和换行转为 Anki 可识别的 HTML 标签（<b> 和 <br>），导入时请勾选“允许使用 HTML”。",
    export_one_line_per_word: "每行一个单词（无引号，换行转空格）",
    export_save_location: "保存位置：",
    export_select_folder: "选择文件夹",
    export_filename: "文件名：",
    export_success: "成功导出至 {0}",
    export_no_wordbook: "请至少选择一个单词本",
    export_no_word: "所选单词本中没有符合范围的单词",
    export_overwrite_confirm: "文件已存在，是否覆盖？",
    export_status_learning: "学习中",
    export_status_mastered: "掌握",
    export_status_ignored: "忽略",
    export_mastered: "导出掌握",
    export_ignored: "导出忽略",
    export_mastered_desc: "导出所有标记为掌握的单词，每行一个的 .txt 文本",
    export_ignored_desc: "导出所有标记为忽略的单词，每行一个的 .txt 文本",
    export_simple_success: "成功导出 {0} 个单词到 {1}",
    export_simple_no_words: "没有找到 {0} 的单词",
    export_simple_file_exist: "文件已存在，是否覆盖？",
    export_mastered_file_name: "掌握单词.txt",
    export_ignored_file_name: "忽略单词.txt",
    export_export: "导出",
    export_single_card: "导出为 Markdown",
    export_enter_filename: "请输入文件名。",
    export_failed: "导出失败，请查看控制台错误。",

    plugin_language: "插件语言",
    plugin_language_desc: "选择插件的显示语言。“自动”将自动与 Obsidian 的界面语言同步。",
    language_follow_obsidian: "自动",
    settings_highlight_preview: "高亮与预览",
    settings_enable_highlight: "启用自动高亮",
    settings_highlight_color: "高亮颜色",
    settings_highlight_color_desc: "高亮颜色，“默认”则使用主题强调色。",
    color_default_desc: "默认（主题强调色）",
    color_custom_picker_tooltip: "自定义：点击选择颜色",
    settings_follow_card: "跟随卡片颜色",
    settings_follow_card_desc: "开启后，背景高亮跟随侧边栏卡片颜色。",
    settings_enable_text_highlight: "文本颜色高亮",
    settings_enable_text_highlight_desc: "开启后，使用文字颜色代替背景高亮。仅对 Markdown 文件生效，PDF 仍使用背景高亮。",
    settings_md_opacity: "Markdown 高亮透明度",
    settings_md_opacity_desc: "控制 Markdown 文件中高亮背景的不透明度（默认值：30%）",
    settings_pdf_opacity: "PDF 高亮透明度",
    settings_pdf_opacity_desc: "控制 PDF 文件中高亮背景的不透明度（默认值：70%）",
    settings_underline_color: "下划线颜色",
    settings_underline_color_desc: "若设置，下划线将使用此颜色（覆盖高亮颜色）。",
    underline_color_default: "默认（跟随高亮颜色）",
    settings_enable_hover: "启用悬停预览",
    settings_blur_definitions: "启用模糊释义",
    settings_blur_desc: "默认模糊显示释义，悬停时清晰显示",
    settings_enable_fold: "启用折叠释义",
    settings_enable_fold_desc: "在单词卡片上默认折叠释义区域，点击 ▶ 按钮展开查看。",
    settings_enable_mastery: "启用掌握/忽略按钮",
    settings_enable_mastery_desc: "在侧边栏和查词面板的单词卡片上显示或隐藏掌握（😊/😐）和忽略（👁️/👁️‍🗨️）操作按钮。",
    settings_highlight_styles: "高亮样式",
    settings_style_underline_type: "下划线样式",
    settings_style_none: "无",
    settings_style_solid: "实线下划线",
    settings_style_dashed: "虚线下划线",
    settings_style_dotted: "点状下划线",
    settings_style_wavy: "波浪下划线",
    settings_style_double: "双下划线",
    settings_style_bold: "粗体",
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
    settings_scope_mode_desc: "如果高亮范围包含词源文件，那么单词卡片中对应的词源匹配词也会高亮。",
    settings_scope_mode_include: "仅包含以下路径",
    settings_scope_mode_exclude: "仅排除以下路径",
    settings_scope_paths: "路径列表",
    settings_scope_paths_desc: "每行一个路径。Markdown 文件必须包含 '.md' 后缀。输入 '*' 可匹配仓库根目录下的所有文件（不含子文件夹）。",
    scope_paths_placeholder: "文件夹/笔记.md\n文件夹",
    settings_tab_files: "文件",
    settings_tab_general: "常规",
    command_open_settings: "打开设置",

    settings_tab_tts: "发音",
    tts_pronunciation_general: "通用发音设置",
    tts_default_lang_label: "默认发音语言",
    tts_default_lang_desc: "当单词未设置「lang」字段时，使用此语言发音",
    language_current_detail: "当前语言详情",
    language_display_name: "显示名称",
    language_standard_code: "标准代码",
    language_code_desc: "可从下拉选择内置语言，或手动输入 BCP 47 标准代码。",
    preset_google: "Google",
    preset_baidu: "百度",
    preset_system: "系统",
    preset_custom: "自定义",
    language_preset_codes: "各预设自定义代码",
    language_reset_default: "重置为默认值",
    language_add: "新增语言",
    language_deleted: "语言已删除",
    language_updated: "语言已更新",
    language_added: "语言已添加",
    language_delete_confirm: "确定删除该语言吗？",
    language_delete_confirm_with_count: "该语言已被 {0} 个单词使用，确定删除吗？",
    language_cannot_delete_en: "不能删除回退语言 'en'。",
    language_fill_required: "请填写完整信息",
    language_code_exists: "标准代码已存在",
    language_edit_title: "新增/编辑语言",
    tts_network_tts_title: "网络 TTS",
    settings_tts_template: "TTS 地址模板",
    tts_template_desc: "可使用 {{word}}, {{type}}, {{accent}}, {{lang}}, {{rate}} 占位符",
    settings_variant: "发音偏好",
    tts_preset_label: "TTS 预设模板",
    tts_preset_desc: "快速切换内置 TTS 服务，选择后自动填充下方模板",
    tts_preset_custom: "自定义",
    tts_preset_youdao: "有道（仅英语）",
    tts_preset_baidu: "百度（多语言）",
    tts_preset_google: "Google（多语言）",
    tts_variant_desc: "美式/英式发音，仅对使用 {{type}} 的模板生效（如有道）",
    tts_speech_rate_label: "语速",
    tts_speech_rate_desc: "调整发音速度",
    tts_speech_rate_reset: "恢复默认",
    tts_speech_rate_reset_tooltip: "恢复当前预设的默认值",
    tts_speech_rate_min: "最小值",
    tts_speech_rate_max: "最大值",
    tts_speech_rate_current: "当前语速: {0}",
    tts_test_label: "发音测试",
    tts_test_desc: "输入单词测试当前网络 TTS 配置",
    tts_test_play: "播放",
    word_lang_label: "发音语言 (lang)",
    word_lang_desc: "选择单词的语言，默认跟随“默认发音语言”。",
    notice_tts_playback_failed: "TTS 播放失败，请检查网络或切换其他预设。",
    tts_system_tts_title: "系统 TTS",
    tts_system_tts_enable: "启用 系统 TTS",
    tts_system_tts_desc: "使用浏览器/操作系统的本地语音合成引擎，完全离线，支持多语言。启用后优先使用“系统 TTS”，若系统语音不可用，将自动回退到“网络 TTS”。",
    tts_system_voice_label: "语音选择",
    tts_system_voice_loading: "正在加载系统语音...",
    tts_system_voice_no_voices: "无可用语音",
    tts_system_voice_default: "默认",
    tts_system_voice_desc: "“默认”会根据单词的「lang」字段自动匹配语音；若未设置该字段，则使用“默认发音语言”。若仍无匹配，将提示缺少语音包。选择具体语音后，则固定使用该语音，不再自动切换。",
    tts_system_voice_test: "试听",
    tts_system_test_text: "你好，这是测试语音。",
    tts_system_rate_label: "语速",
    tts_system_rate_desc: "调整发音速度。默认 1.0，范围 0.5~2.0。",
    tts_system_pitch_label: "音高",
    tts_system_pitch_desc: "调整音高。默认 1.0，范围 0.5~2.0。",
    tts_system_hint: "📢 使用操作系统内置语音引擎，完全离线。若发音异常，请检查系统语音设置。",
    tts_system_fallback_notice: "当前系统无 {lang} 语音，请切换回网络 TTS 或更换系统语音。",
    tts_system_auto_switched: "已自动切换到 {voice} 以支持当前语言。",
    tts_system_no_voice_for_lang: "当前系统缺少 {lang} 语音包，请安装语音包或关闭“系统 TTS”。",
    command_pronounce_selected: "朗读选中的文本",
    tts_test_enter_word: "请输入要测试的单词。",

    settings_tab_ai: "AI",
    settings_api_config: "API 配置",
    settings_ai_provider: "服务提供商",
    settings_ai_provider_desc: "选择预设服务商或自定义",
    settings_ai_api_url: "API 地址",
    settings_ai_api_key: "API 密钥",
    settings_ai_model: "模型名称",
    provider_openai: "OpenAI",
    provider_deepseek: "DeepSeek",
    provider_glm: "智谱 GLM",
    provider_tongyi: "通义千问",
    provider_ollama: "Ollama (本地)",
    provider_custom: "自定义",
    api_url_placeholder_custom: "请输入 API 地址",
    api_url_placeholder_preset: "自动填充",
    api_key_placeholder: "请输入 API Key",
    api_model_placeholder: "模型名称",
    settings_prompts: "提示词",
    settings_system_prompts: "系统提示词",
    settings_system_prompt_desc: "设定 AI 的“人设”（AI 回复的风格/格式）",
    settings_builtin_prompts: "内置系统提示词",
    settings_builtin_desc: "选择预设风格预览内容，可一键复制后粘贴到自定义列表中修改。",
    settings_select_builtin: "选择内置风格",
    settings_copy_content: "📋 复制内容",
    settings_copied: "已复制到剪贴板！",
    settings_copy_empty: "没有可复制的内容。",
    builtin_label: "内置",
    settings_system_prompt_name: "名称",
    settings_system_prompt_content: "系统提示内容",
    settings_add_system_prompt: "添加系统提示词",
    settings_default_system_prompt: "默认提示词关联的系统提示词",
    settings_default_system_prompt_desc: "选择本提示词关联的系统提示词，'无'表示不发送系统指令",
    settings_system_prompt_none: "无",
    settings_system_prompt_duplicate: "名称已存在",
    settings_system_prompt_empty: "名称和内容不能为空",
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
    lookup_enter_mode_desc: "选择在搜索框中按回车时的行为。\nShift + Enter 默认使用 AI 查询",
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
    notice_ignored_label_on: "取消忽略",
    notice_ignored_label_off: "标记忽略",
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
    section_default_title: "释义",
    section_content_prefix: "内容",

    settings_api_key_mode: "API 密钥 存储模式",
    settings_api_key_mode_secret: "官方密钥链",
    settings_api_key_mode_local: "本地加密",
    settings_api_key_verifying: "⏳ 验证中...",
    settings_api_key_status_missing: "⚠️ 钥匙串中未找到该密钥，已关联：{0}",
    settings_api_key_status_corrupted: "⚠️ 当前密钥数据损坏或不可读，请重新输入密钥",
    settings_api_key_status_error: "⚠️ 验证失败",
    settings_api_key_status_associated: "已关联：{0}",
    settings_api_key_status_not_selected: "未选择密钥",
    settings_api_key_status_encrypted: "已加密存储",
    settings_api_key_status_not_set: "未设置密钥",
    settings_api_key_migrate_title: '切换至「{0}」模式',
    settings_api_key_migrate_desc: "检测到当前模式已保存有效密钥。是否将密钥迁移到新模式？",
    settings_api_key_migrate_skip: "跳过（仅切换模式）",
    settings_api_key_migrate_confirm: "迁移密钥",
    settings_api_key_new_name: "密钥名称",
    settings_api_key_new_name_desc: "用于在官方密钥链中标识此密钥",
    notice_api_migrated: "🔒 API Key 已自动加密存储（仅限本 Vault 使用）",
    notice_api_switch_mode: '已切换至「{0}」模式',
    notice_api_saved_encrypted: "✅ API Key 已加密保存",
    notice_api_migrate_fail: "迁移到官方密钥链失败：{0}",
    notice_secret_storage_unavailable: "⚠️ 当前 Obsidian 版本不支持官方密钥链，已切换到本地加密模式。",

    example_fetch_btn: "获取当前文档例句",
    example_picker_title: "选择 / 编辑例句",
    example_picker_desc: "下方已自动提取当前单词所在的内容，你可自由修改或删减，然后点击“确认”插入到释义中。",
    example_picker_confirm: "确认插入例句",
    example_appended: "✅ 已添加内容到「{0}」章节",
    example_no_sentence: "未提取到内容，请手动输入或重新定位光标。",
    example_edit_only: "该功能仅在编辑模式下可用",
    example_extract_mode: "提取方式：",
    example_extract_mode_desc: "切换提取方式将覆盖当前编辑的内容。",
    example_mode_paragraph: "按空行分隔提取",
    example_mode_line: "按换行分隔提取",
    example_mode_sentence: "按句子边界提取",
    example_mode_list: "按列表项提取",
    example_mode_paragraph_desc: "以空行为边界，提取光标所在的完整段落。",
    example_mode_line_desc: "以换行为边界，提取光标所在的当前行。",
    example_mode_sentence_desc: "智能识别标点（。！？.!?），提取光标所在的句子。",
    example_mode_list_desc: "检测列表标记（-、*、数字.），提取光标所在的列表项。",
    example_section_title: "例句",
    example_section_title_label: "章节标题",
    example_no_content: "未提取到内容，请手动输入。",

    library_view_title: "词库管理",
    library_search_placeholder: "搜索单词或别名...",
    library_filter_color_all: "所有颜色",
    library_filter_color_default: "默认",
    library_filter_status_all: "所有状态",
    library_filter_status_learning: "学习中",
    library_filter_status_mastered: "掌握",
    library_filter_status_ignored: "忽略",
    library_filter_source_all: "所有来源",
    library_sort_field_word: "单词",
    library_sort_field_status: "状态",
    library_sort_field_color: "颜色",
    library_sort_field_source: "来源",
    library_sort_toggle: "切换排序方向",
    library_select_all_title: "全选/取消全选",
    library_batch_selected: "已选中 {0} 项",
    library_batch_color: "修改颜色",
    library_batch_mastered: "标记掌握",
    library_batch_unmaster: "取消掌握",
    library_batch_ignore: "标记忽略",
    library_batch_unignore: "取消忽略",
    library_batch_delete: "删除选中",
    library_batch_clear: "清空选择",
    library_stats_total: "总计: {0}",
    library_stats_mastered: "掌握: {0} ({1}%)",
    library_stats_learning: "学习: {0} ({1}%)",
    library_stats_ignored: "忽略: {0} ({1}%)",
    library_table_header_select: "选择",
    library_table_header_word: "单词",
    library_table_header_phonetic: "音标",
    library_table_header_definition: "释义",
    library_table_header_source: "来源",
    library_table_header_color: "颜色",
    library_table_header_status: "状态",
    library_empty: "没有匹配的单词。",
    library_status_mastered: "掌握",
    library_status_learning: "学习",
    library_status_ignored: "忽略",
    library_confirm_delete_batch: "确定删除选中的 {0} 个单词吗？",
    library_batch_delete_success: "已删除 {0} 个单词。",
    library_batch_color_success: "已更新 {0} 个单词的颜色。",
    library_batch_mastered_success: "已标记 {0} 个单词为掌握。",
    library_batch_ignored_success: "已标记 {0} 个单词为忽略。",
    library_batch_unmaster_success: "已取消 {0} 个单词的掌握。",
    library_batch_unignored_success: "已取消 {0} 个单词的忽略。",
    command_open_library: "打开词库管理",
    ribbon_library_tooltip: "词库管理",
    library_copy_word: "复制单词",
    library_copy_phonetic: "复制音标",
    library_copy_definition: "复制释义",
    library_copy_source: "复制来源路径",
    library_copy_all: "复制全部信息",
    copy_all_word: "单词：",
    copy_all_phonetic: "音标：",
    copy_all_source: "来源：",
    copy_all_definition: "释义：",
    library_batch_delete_success: "已全部成功删除，共 {0} 个单词。",
    library_batch_delete_failed: "已删除 {0} 个单词，{1} 个失败：{2}",
    library_batch_delete_and_more: "… 还有 {0} 个",
    library_batch_delete_see_console: "详情请查看控制台。",

    study_view_title: "学习中心",
    study_ribbon_tooltip: "学习中心",
    study_command_open: "打开学习中心",
    study_today_goal: "今日：{0}/{1}",
    study_stats_total: "总词汇",
    study_stats_learning_rate: "学习占比",
    study_stats_mastered_rate: "掌握占比",
    study_stats_ignored_rate: "忽略占比",
    study_stats_today_progress: "今日进度",
    study_stats_streak: "连续学习",
    study_stats_streak_days: "{0} 天",
    study_tab_review: "📖 复习",
    study_tab_mastered: "✅ 掌握",
    study_tab_stats: "📊 统计",
    study_tab_settings: "⚙️ 设置",
    study_review_motivation: "今日到期{0}个词，本轮复习{1}个词，冲鸭！",
    study_review_empty: "今日没有需要复习的单词 🎉",
    study_review_done: "复习完成！本轮复习了 {0} 个单词，今日累计复习了 {1} 个单词。",
    study_review_progress: "第 {0}/{1} 个 · 等级 {2} · 距下次 {3} 天",
    study_card_hint: "双击或按空格显示释义",
    study_btn_forget: "😣 忘记",
    study_btn_remember: "😊 记得",
    study_btn_start: "开干！💪",
    study_btn_again: "再来一轮",
    study_btn_back: "返回准备",
    study_mastered_list_empty: "还没有已掌握的单词。",
    study_stats_retention: "记忆保持率",
    study_stats_learning_distribution: "学习状态分布",
    study_stats_trend: "学习趋势（30天）",
    study_stats_level_distribution: "等级分布",
    study_stats_source_distribution: "来源分布",
    study_stats_color_distribution: "颜色分布",
    study_settings_title: "学习设置",
    study_settings_daily_goal: "每日目标",
    study_settings_daily_goal_desc: "每日计划复习的单词数量",
    study_settings_daily_limit: "单次复习上限",
    study_settings_daily_limit_desc: "每次复习最多可复习的单词数",
    study_settings_review_order: "复习排序",
    study_settings_review_order_desc: "控制到期复习队列中所有词的排序方式",
    study_settings_review_order_due: "到期优先",
    study_settings_review_order_high_level: "高等级优先",
    study_settings_review_order_low_level: "低等级优先",
    study_settings_flashcard_phonetic: "显示音标",
    study_settings_flashcard_phonetic_desc: "在卡片上显示音标",
    study_settings_flashcard_autoflip: "自动翻转（秒）",
    study_settings_flashcard_autoflip_desc: "几秒后自动翻转卡片（0=关闭）",
    study_reset_progress: "重置所有复习进度",
    study_reset_desc: "重置所有复习进度和统计数据，此操作不可撤销。",
    study_reset_confirm: "确定要重置所有复习进度吗？这将清除所有复习记录和统计数据。",
    study_reset_success: "复习进度已重置。",
    study_btn_exit: "退出复习",
    study_btn_prev: "上一个",
    study_btn_next: "下一个",
    study_shortcut_hint: "← 忘记 ｜ 记得 →",
    study_shortcut_hint_4btn: "← 忘记 ｜ 良好 →\n↑ 简单 ｜ 困难 ↓",
    study_tab_levels: "📈 等级",
    study_level_all: "全部等级",
    study_level_label: "等级 {0}",
    study_no_words_for_level: "该等级暂无单词",
    trend_today_label: "📌 今日复习：{0} 个单词",
    trend_summary_label: "📊 总计 {0} · 日均 {1} · 峰值 {2}",
    study_table_header_level: "等级",
    study_table_header_actions: "操作",
    study_level_search_placeholder: "搜索单词...",
    study_level_search_empty: '没有找到 "{0}" 的单词',
    study_goal_cannot_exceed_limit: "每日目标不能超过单次复习上限（{0}）。",
    study_goal_adjusted_to_limit: "每日目标已自动调整为 {0} 以匹配复习上限。",
    study_settings_flashcard_tabs: "释义以标签页显示",
    study_settings_flashcard_tabs_desc: "在复习卡片上将多段释义显示为标签页形式，按数字键 1-9 快速切换。",
    study_prep_wordbook: "词库",
    study_prep_all: "综合所有词库",
    study_prep_total: "总计",
    study_prep_mastered: "已掌握",
    study_prep_ignored: "已忽略",
    study_prep_learning: "待复习",
    study_prep_no_wordbooks: "没有启用的词库",
    study_prep_empty_book: "该词库为空",
    study_prep_all_mastered: "没有单词需要复习！",
    study_level_list_empty: "没有找到任何复习记录。",
    study_settings_intervals: "复习间隔 (等级 0~4)",
    study_settings_intervals_desc: "自定义等级 0~4 的基础复习间隔（天）。实际间隔 = 基础间隔 × 难易系数。仅下次复习生效。",
    study_intervals_reset: "恢复默认",
    study_intervals_reset_notice: "已恢复默认间隔: 1, 2, 4, 8, 16 天",
    study_intervals_updated_notice: "间隔已更新，下次复习生效",
    study_btn_hard: "😐 困难",
    study_btn_good: "🙂 良好",
    study_btn_easy: "😊 简单",
    study_sort_level_asc: "等级 ↑ (0→5)",
    study_sort_level_desc: "等级 ↓ (5→0)",
    study_sort_diff_asc: "难易系数 ↑",
    study_sort_diff_desc: "难易系数 ↓",
    study_sort_review_asc: "复习次数 ↑",
    study_sort_review_desc: "复习次数 ↓",
    library_table_header_difficulty: "难易系数",
    study_table_header_review_count: "复习次数",
    settings_enable_fine_feedback: "精细反馈",
    settings_enable_fine_feedback_desc: "复习卡片显示 4 个反馈按钮（忘记/困难/良好/简单）",
    study_type_filter_all: "全部类型",
    study_type_newbie: "🔵 新手词",
    study_type_steady: "🟡 稳步词",
    study_type_efficient: "🟢 高效词",
    study_type_struggling: "🟠 吃力词",
    study_type_stubborn: "🔴 顽固词",
    study_params_advanced: "高级设置",
    study_params_baseDelta: "基础难易系数",
    study_params_extraDelta: "额外难易系数 + 奖励阈值",
    study_params_range: "难易系数范围",
    study_params_min: "最小值：",
    study_params_max: "最大值：",
    study_params_threshold: "奖励阈值（count）：≥",
    study_params_suspend: "搁置参数 + 惩罚阈值",
    study_params_suspend_thresholds: "惩罚阈值（count）：",
    study_params_suspend_again: "忘记搁置（天）：",
    study_params_suspend_hard: "困难搁置（天）：",
    study_params_reset: "重置为默认值",
    study_params_reset_confirm: "确定重置为默认参数吗？",
    study_params_reset_success: "✅ 已重置为默认参数",
    study_params_help_title: "参数说明：",
    study_params_help_baseDelta: "基础难易系数：每次复习点击按钮后的难易系数变化（负=缩短间隔，正=延长间隔）。",
    study_params_help_extraDelta: "额外难易系数：连续良好/简单 ≥ {0} 次后的额外奖励。",
    study_params_help_suspend: "搁置参数 + 惩罚阈值：连续忘记/困难达到惩罚阈值 X 次后搁置 Y 天。",
    study_params_help_threshold_note: "阈值（count）：奖励阈值是连续点击良好或简单的累积次数，惩罚阈值同理。",
    study_params_apply_threshold_duplicate: "❌ 惩罚阈值不能重复",
    study_params_import_minmax: "❌ 难易系数最小值必须小于最大值",
    study_params_again: "忘记：",
    study_params_hard: "困难：",
    study_params_good: "良好：",
    study_params_easy: "简单：",
    study_settings_new_word_order: "新词补充顺序",
    study_settings_new_word_order_desc: "当到期词不足时，从词库中补充新词的顺序。",
    study_new_word_order_sequential: "顺序",
    study_new_word_order_random: "随机",

    github_link_text: `点击进入 <a href="https://github.com/Bin-T/obsidian-simple-wordbook" target="_blank" rel="noopener noreferrer" class="github-link" style="color: var(--text-accent); text-decoration: none;">Github</a> 下载 <a href="https://github.com/Bin-T/obsidian-simple-wordbook/tree/main/wordbooks" target="_blank" rel="noopener noreferrer" class="github-link" style="color: var(--text-accent); text-decoration: none;">单词本</a>，喜欢给项目点个 ⭐`,

    builtin_prompt_default_name: "默认",
    builtin_prompt_default_content: "你是一位词典助手。请准确简洁地回答。使用与用户提问相同的语言回复。",
    builtin_prompt_cute_name: "可爱软萌风",
    builtin_prompt_cute_content: "软萌可爱少女风格，用词简短俏皮，适合美妆、宠物、生活种草文案，语气轻快柔和，避免正式生硬表达。用与用户提问相同的语言回复。",
    builtin_prompt_trendy_name: "网络潮酷风",
    builtin_prompt_trendy_content: "走年轻网友网感风格，合理使用温和网络流行语，读懂俚语并转化成与用户提问相同语言的易懂梗，语气轻松随性，适合社交平台。用与用户提问相同的语言回复。",
    builtin_prompt_daily_name: "日常口语风",
    builtin_prompt_daily_content: "采用普通人日常口语风格，短句易懂，抛弃书面化表达，贴合短视频字幕语感，不生硬直译，完整保留原意。用与用户提问相同的语言回复。",
    builtin_prompt_business_name: "商务正式风",
    builtin_prompt_business_content: "标准职场正式文风，用词严谨得体，句式规范，适配商务邮件、工作汇报、企业对外文案，礼貌中立，不使用口语俚语。用与用户提问相同的语言回复。",
    builtin_prompt_academic_name: "公文庄重风",
    builtin_prompt_academic_content: "学术标准翻译，符合期刊论文写作规范，专业术语准确客观，语句逻辑严谨，第三人称客观叙述，无情绪化口语，适配科研报告、论文。用与用户提问相同的语言回复。",
    builtin_prompt_literary_name: "文艺唯美风",
    builtin_prompt_literary_content: "文学唯美翻译，散文文艺文风，保留原文意境与情感，用词优美有画面感，句式舒缓细腻，适合随笔、抒情文案，拒绝直白大白话。用与用户提问相同的语言回复。",
  }
};


// 轻量级语言工具
function getLocale() {
  // 检查插件自身语言设置
  const plugin = globalThis.__simpleWordbookPlugin;
  if (plugin?.settings?.pluginLanguage === "en") return locale.en;
  if (plugin?.settings?.pluginLanguage === "zh") return locale.zh;

  // 自动检测 Obsidian 当前界面语言
  const lang = window.localStorage.getItem("language") || "en";
  // 标准化语言代码：'zh-TW' -> 'zh', 'en-US' -> 'en'
  const normalizedLang = lang.split('-')[0];

  // 如果 locale 中存在该语言，直接返回；否则回退到英文
  if (locale[normalizedLang]) {
    return locale[normalizedLang];
  }
  return locale.en;
}

function t(key, ...args) {
  const currentLocale = getLocale();
  // 优先当前语言，没有则回退到英文，再没有才显示 key 本身
  let text = currentLocale[key] || locale.en[key] || key;
  for (let i = 0; i < args.length; i++) {
    text = text.replace(`{${i}}`, args[i]);
  }
  return text;
}

// ========== 内置系统提示词 ==========
function getBuiltinPromptKeys() {
  return ["default", "cute", "trendy", "daily", "business", "academic", "literary"];
}

// 获取所有系统提示词选项（内置+自定义）
function getAllSystemPromptOptions(settings) {
  const builtinKeys = getBuiltinPromptKeys();
  const builtins = builtinKeys.map(key => ({
    key: "builtin_" + key,
    name: t("builtin_prompt_" + key + "_name"),
    content: t("builtin_prompt_" + key + "_content"),
    type: 'builtin'
  }));
  const customs = (settings.systemPrompts || []).map(p => ({
    key: p.name,
    name: p.name,
    content: p.content,
    type: 'custom'
  }));
  return [...builtins, ...customs];
}

// 根据 key 获取系统提示词内容
function getSystemPromptContent(key, settings) {
  if (!key) return null;
  if (key.startsWith("builtin_")) {
    const builtinKey = key.replace("builtin_", "");
    return t("builtin_prompt_" + builtinKey + "_content");
  } else {
    const custom = (settings.systemPrompts || []).find(p => p.name === key);
    return custom ? custom.content : null;
  }
}

// ========== 内置语言映射表 ==========
const BUILTIN_LANGUAGES = [
  {
    id: "en",
    displayName: "English (US)",
    standardCode: "en",
    presetCodes: { google: "en", baidu: "en", system: "en-US", custom: "en" }
  },
  {
    id: "en-GB",
    displayName: "English (UK)",
    standardCode: "en-GB",
    presetCodes: { google: "en-GB", baidu: "en", system: "en-GB", custom: "en-GB" }
  },
  {
    id: "zh",
    displayName: "中文",
    standardCode: "zh",
    presetCodes: { google: "zh", baidu: "zh", system: "zh-CN", custom: "zh" }
  },
  {
    id: "ja",
    displayName: "日本語",
    standardCode: "ja",
    presetCodes: { google: "ja", baidu: "jp", system: "ja-JP", custom: "ja" }
  },
  {
    id: "ko",
    displayName: "한국어",
    standardCode: "ko",
    presetCodes: { google: "ko", baidu: "kor", system: "ko-KR", custom: "ko" }
  },
  {
    id: "fr",
    displayName: "Français",
    standardCode: "fr",
    presetCodes: { google: "fr", baidu: "fra", system: "fr-FR", custom: "fr" }
  },
  {
    id: "de",
    displayName: "Deutsch",
    standardCode: "de",
    presetCodes: { google: "de", baidu: "de", system: "de-DE", custom: "de" }
  },
  {
    id: "es",
    displayName: "Español",
    standardCode: "es",
    presetCodes: { google: "es", baidu: "spa", system: "es-ES", custom: "es" }
  },
  {
    id: "it",
    displayName: "Italiano",
    standardCode: "it",
    presetCodes: { google: "it", baidu: "it", system: "it-IT", custom: "it" }
  },
  {
    id: "ru",
    displayName: "Русский",
    standardCode: "ru",
    presetCodes: { google: "ru", baidu: "ru", system: "ru-RU", custom: "ru" }
  },
  {
    id: "ar",
    displayName: "العربية",
    standardCode: "ar",
    presetCodes: { google: "ar", baidu: "ara", system: "ar-SA", custom: "ar" }
  },
  {
    id: "pt",
    displayName: "Português",
    standardCode: "pt",
    presetCodes: { google: "pt", baidu: "pt", system: "pt-PT", custom: "pt" }
  },
  {
    id: "nl",
    displayName: "Nederlands",
    standardCode: "nl",
    presetCodes: { google: "nl", baidu: "nl", system: "nl-NL", custom: "nl" }
  },
  {
    id: "pl",
    displayName: "Polski",
    standardCode: "pl",
    presetCodes: { google: "pl", baidu: "pl", system: "pl-PL", custom: "pl" }
  },
  {
    id: "tr",
    displayName: "Türkçe",
    standardCode: "tr",
    presetCodes: { google: "tr", baidu: "tr", system: "tr-TR", custom: "tr" }
  },
  {
    id: "vi",
    displayName: "Tiếng Việt",
    standardCode: "vi",
    presetCodes: { google: "vi", baidu: "vi", system: "vi-VN", custom: "vi" }
  }
];

const DEFAULT_SETTINGS = {
  wordbookFiles: [],
  masteryMode: "global",  // 可选 "per-source" 或 "global"
  masteryFilePath: "",
  ignoredFilePath: "",
  pluginLanguage: "auto",
  enableHighlight: true,
  enableHoverPreview: true,
  enableBlurDefinition: false,
  enableFoldDefinition: false,
  enableMastery: true,
  highlightColor: "",
  customHighlightColor: "",
  mdHighlightOpacity: 30,   // Markdown 高亮透明度，0-100，默认 30%
  pdfHighlightOpacity: 70,  // PDF 高亮透明度，0-100，默认 70%
  underlineColor: "",
  followCardColor: true,
  enableTextColorHighlight: false,
  highlightStyles: {
    underlineType: "none",
    bold: false
  },
  enableHighlightScopeFilter: false,
  enableSidebarScopeFilter: false,
  scopeMode: "include",
  scopePaths: [],
  enterMode: "local_only",  // 可选 "local_only", "ai_only", "local_first"
  localSearchMode: "smart",    // "smart", "exact", "prefix", "contains", "fuzzy"
  maxLocalResults: 10,         // 默认改为10

  languages: BUILTIN_LANGUAGES,
  defaultLanguage: "en",      // 默认发音语言（卡片无 lang 时回退）
  ttsPreset: "youdao",        // 当前选中的预设：'custom' | 'youdao' | 'baidu' | 'google'
  ttsUrlTemplate: "https://dict.youdao.com/dictvoice?audio={{word}}&type={{type}}",
  customTtsUrlTemplate: "",
  pronunciationVariant: "us",
  speechRatePresets: {
    youdao: { min: 1, max: 5, value: 3 },
    baidu: { min: 1, max: 5, value: 3 },
    google: { min: 0.24, max: 1.5, value: 0.8 },
    custom: { min: 0.5, max: 2.0, value: 1.0 }
  },
  enableSystemTTS: false,
  systemTTSVoiceName: "",
  systemTTSSpeechRate: 1.0,
  systemTTSPitch: 1.0,

  lastUsedCardColor: "",

  // ===== AI 查词设置 =====
  apiProvider: "openai",
  apiBaseUrl: "https://api.openai.com/v1/chat/completions",
  api: {
    mode: "secret_storage",        // "secret_storage" | "local_encrypted"
    secretName: "",                // 钥匙串引用名（仅 mode=secret_storage 时有效）
    encryptedData: null,           // { ciphertext, salt } 或 null
  },
  apiModel: "gpt-3.5-turbo",
  systemPrompts: [],          // [{ name: "词典助手", content: "You are a dictionary assistant..." }]
  defaultSystemPrompt: "",    // 默认提示词关联的系统提示词名称
  defaultPrompt: "用中文解释单词 {word}的释义。",
  customPrompts: [],          // [{ name: "快速释义", content: "给出 {word} 的中文释义", system_prompt: ""  }]
  selectedPrompt: "默认",     // 当前选中的提示词名称

  // ===== 学习中心设置 =====
  study: {
    dailyGoal: 10,
    dailyReviewLimit: 20,
    flashcardAutoFlip: 0,          // 秒，0 表示关闭
    newWordOrder: "sequential",  // "sequential" | "random"
    reviewOrder: "due_first",
    flashcardShowPhonetic: true,
    flashcardShowTabs: true,
    enableFineFeedback: false,
    intervalDays: [1, 2, 4, 8, 16],
    selectedWordbook: "all",
  },

  // ---- 学习算法参数 ----
  studyParams: {
    baseDelta: {
      again: -0.12,
      hard: -0.08,
      good: 0.05,
      easy: 0.12
    },
    extraDelta: {
      good: 0.05,
      easy: 0.03
    },
    difficultyMin: 0.7,
    difficultyMax: 1.5,
    rewardThreshold: 3,
    suspend: {
      again: [
        { threshold: 3, days: 4 },
        { threshold: 6, days: 8 },
        { threshold: 9, days: 30 }
      ],
      hard: [
        { threshold: 3, days: 3 },
        { threshold: 6, days: 5 },
        { threshold: 9, days: 15 }
      ]
    }
  },

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

async function playPronunciation(word, ttsTemplate, variant, lang = '') {
  const plugin = globalThis.__simpleWordbookPlugin;

  // 获取当前预设和语言列表，计算实际语言代码
  const preset = plugin?.settings?.ttsPreset || 'custom';
  const languages = plugin?.settings?.languages || [];
  const defaultCode = plugin?.settings?.defaultLanguage || 'en';
  const targetCode = lang || defaultCode;
  let langEntry = languages.find(l => l.standardCode === targetCode);
  if (!langEntry) {
    langEntry = { standardCode: targetCode, presetCodes: {} };
  }
  let effectiveLang;
  if (preset === 'google') {
    effectiveLang = langEntry.presetCodes?.google || langEntry.standardCode;
  } else if (preset === 'baidu') {
    effectiveLang = langEntry.presetCodes?.baidu || langEntry.standardCode;
  } else if (preset === 'system') {
    effectiveLang = langEntry.presetCodes?.system || langEntry.standardCode;
  } else {
    effectiveLang = langEntry.presetCodes?.custom || langEntry.standardCode;
  }

  // ========== 系统 TTS 分支 ==========
  if (plugin && plugin.settings.enableSystemTTS) {
    // 安全检测：speechSynthesis 是否可用
    if (typeof window.speechSynthesis !== 'undefined' && window.speechSynthesis) {
      try {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = effectiveLang;

        // 语速
        const rate = plugin.settings.systemTTSSpeechRate ?? 1.0;
        utterance.rate = Math.min(Math.max(rate, 0.5), 2.0);

        // 音高
        const pitch = plugin.settings.systemTTSPitch ?? 1.0;
        utterance.pitch = Math.min(Math.max(pitch, 0.5), 2.0);

        // 语音选择（若已存储名称）
        const voiceName = plugin.settings.systemTTSVoiceName || "";
        if (voiceName && voiceName !== "default") {
          let voices = window.speechSynthesis.getVoices();
          if (!voices || voices.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
            voices = window.speechSynthesis.getVoices();
          }
          const matchedVoice = voices.find(v => v.name === voiceName || v.voiceURI === voiceName);
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          } else {
            // 若未匹配，尝试按语言自动回退
            const fallback = voices.find(v => v.lang.startsWith(effectiveLang.split('-')[0]));
            if (fallback) {
              utterance.voice = fallback;
              new Notice(t("tts_system_auto_switched", fallback.name));
            } else {
              // 无匹配语音，提示但继续使用默认语音
              new Notice(t("tts_system_fallback_notice", effectiveLang));
            }
          }
        } else {
          // 未选择具体语音，尝试按语言自动匹配
          let voices = window.speechSynthesis.getVoices();
          if (!voices || voices.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
            voices = window.speechSynthesis.getVoices();
          }
          const fallback = voices.find(v => v.lang.startsWith(effectiveLang.split('-')[0]));
          if (fallback) {
            utterance.voice = fallback;
            window.speechSynthesis.speak(utterance);
            return; // 匹配成功 → 发音后返回
          } else {
            // 匹配失败 → 弹出提示，不播放任何声音，不回退到网络 TTS
            const langDisplay = languages.find(l => l.standardCode === effectiveLang)?.displayName || effectiveLang;
            new Notice(t("tts_system_no_voice_for_lang", langDisplay));
            return; // 直接返回，不执行 speak，也不执行网络 TTS
          }
        }

        window.speechSynthesis.speak(utterance);
        return; // 成功发音后返回
      } catch (e) {
        // 系统 TTS 出错（如权限、语音引擎未就绪），记录日志并继续执行网络 TTS
        console.warn('System TTS failed, falling back to network TTS:', e);
        // 不 return，继续执行网络 TTS
      }
    } else {
      console.warn('System TTS not available, falling back to network TTS');
      // 不 return，继续执行网络 TTS
    }
  }

  // ========== 网络 TTS 分支（仅在系统 TTS 未启用时执行） ==========

  // ---------- 构建 URL ----------
  let url = ttsTemplate.replace(/{{word}}/g, encodeURIComponent(word));

  if (url.includes("{{type}}")) {
    const type = variant === "uk" ? "1" : "2";
    url = url.replace(/{{type}}/g, type);
  }
  if (url.includes("{{accent}}")) {
    url = url.replace(/{{accent}}/g, variant);
  }
  if (url.includes("{{lang}}")) {
    url = url.replace(/{{lang}}/g, encodeURIComponent(effectiveLang));
  }

  // ---------- {{rate}} 占位符替换 ----------
  if (url.includes('{{rate}}')) {
    const preset = plugin?.settings?.ttsPreset || 'custom';
    const rateConfig = plugin?.settings?.speechRatePresets?.[preset];
    let rate = rateConfig?.value ?? 1.0;

    // 基于配置的 min/max 做边界限制
    const min = rateConfig?.min ?? 0.5;
    const max = rateConfig?.max ?? 2.0;
    rate = Math.min(Math.max(rate, min), max);

    // 百度需要取整
    if (preset === 'baidu') {
      rate = Math.round(rate);
      // 取整后可能超出 min/max，再钳位一次
      rate = Math.min(Math.max(rate, min), max);
    }

    // Google 保留两位小数
    if (preset === 'google') {
      rate = Math.round(rate * 100) / 100;
    }

    url = url.replace(/{{rate}}/g, String(rate));
  }

  // ---------- 判断是否为 Google TTS ----------
  const isGoogle = url.includes('translate.google.com');

  if (isGoogle) {
    // ---------- Google TTS: 使用 fetch + AbortController（主动超时提示） ----------
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      new Notice(t("notice_tts_playback_failed"));
    }, 5000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);

      const audio = new Audio(blobUrl);
      await audio.play();
      URL.revokeObjectURL(blobUrl);

    } catch (e) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        console.warn('TTS request aborted due to timeout');
        return;
      }
      console.warn('TTS playback failed:', e);
      new Notice(t("notice_tts_playback_failed"));
    }
  } else {
    // ---------- 其他 TTS (有道、百度、自定义): 使用原有 Audio 方式 ----------
    try {
      const audio = new Audio(url);
      await audio.play();
    } catch (e) {
      console.warn("TTS playback failed:", e);
      new Notice(t("notice_tts_playback_failed"));
    }
  }
}

// ========== 加密工具函数（基于 Web Crypto API） ==========

// 将 ArrayBuffer 转为 Base64 字符串
function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// 将 Base64 字符串转为 ArrayBuffer
function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// 派生加密密钥（PBKDF2，基于 Vault 路径 + Vault 名称 + salt）
async function getVaultDerivedKey(app, salt) {
  const vaultPath = app.vault.adapter.basePath || '';
  const vaultName = app.vault.getName() || '';
  const base = vaultPath + '::' + vaultName;
  const enc = new TextEncoder();

  // 将 Vault 路径组合作为密钥材料导入
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(base),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  // PBKDF2 派生，迭代 100000 次，输出 256 位
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt || ''),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  return derivedBits;
}

// 加密明文
async function encryptApiKey(app, plaintext, salt) {
  if (!plaintext) return '';
  const keyData = await getVaultDerivedKey(app, salt);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv: iv },
    cryptoKey,
    enc.encode(plaintext)
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return bufferToBase64(combined.buffer);
}

// 解密密文
async function decryptApiKey(app, ciphertext, salt) {
  if (!ciphertext) return '';
  try {
    const combined = new Uint8Array(base64ToBuffer(ciphertext));
    if (combined.length < 16) return '';
    const iv = combined.slice(0, 16);
    const data = combined.slice(16);
    const keyData = await getVaultDerivedKey(app, salt);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-CBC' },
      false,
      ['encrypt', 'decrypt']
    );
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: iv },
      cryptoKey,
      data
    );
    return new TextDecoder().decode(plaintext);
  } catch (e) {
    return '';
  }
}

// 生成随机盐值（16 字节，Base64）
function generateSalt() {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return bufferToBase64(salt.buffer);
}

// 清理密钥名称（仅保留小写字母、数字、破折号，最长64字符）
function sanitizeSecretName(name) {
  if (!name) return "";
  // 转为小写，替换非法字符为破折号（连续多个破折号合并为一个）
  let cleaned = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  // 合并连续破折号
  cleaned = cleaned.replace(/-+/g, '-');
  // 去掉首尾破折号
  cleaned = cleaned.replace(/^-|-$/g, '');
  // 截断到64字符
  if (cleaned.length > 64) cleaned = cleaned.slice(0, 64);
  return cleaned;
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
      title = sections.length === 0 ? t("section_default_title") : `${t("section_content_prefix")} ${sections.length + 1}`;
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
      lang: card.lang || "",
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
        sections: sections.length > 0 ? sections : [{ title: t("section_default_title"), content: def }],
        phonetic: card.phonetic || "",
        lang: card.lang || ""
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
        this.masteryData[word].updatedAt = this.getLocalDateTimeString();
      }
    }
    for (const word of Object.keys(mergedIgnored)) {
      if (!this.ignoredData[word]) this.ignoredData[word] = {};
      this.ignoredData[word].ignored = true;
      this.ignoredData[word].updatedAt = this.getLocalDateTimeString();
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
            this.ignoredData[sourceKey].updatedAt = this.getLocalDateTimeString();
          } else if (isMastered) {
            if (!this.masteryData[sourceKey]) this.masteryData[sourceKey] = {};
            this.masteryData[sourceKey].mastered = true;
            this.masteryData[sourceKey].updatedAt = this.getLocalDateTimeString();
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

  // ----- 获取本地时间戳字符串（YYYY-MM-DD HH:MM:SS）-----
  getLocalDateTimeString(date) {
    if (!date) date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // ----- 标记掌握 -----
  async setMastered(key, mastered) {
    try {
      if (mastered) {
        // 1. 清除忽略状态（直接删除，不创建记录）
        if (this.ignoredData[key]) {
          delete this.ignoredData[key];
        }

        // 2. 写入掌握状态
        if (!this.masteryData[key]) this.masteryData[key] = {};
        this.masteryData[key].mastered = true;
        this.masteryData[key].updatedAt = this.getLocalDateTimeString();

        // 3. 仅当复习记录存在时才更新等级为5（终止复习）
        const review = this.plugin.studyStore.getReviewByKey(key);
        if (review) {
          await this.plugin.studyStore.setReviewLevel(key, 5);
        }
        // 无记录：不创建，仅保存 masteryData

      } else {
        // 取消掌握
        if (this.masteryData[key]) delete this.masteryData[key];
        await this.plugin.studyStore.setReviewLevel(key, 0);
      }

      // 保存两个文件（若未修改，内部会跳过）
      await this.saveMastery();
      await this.saveIgnored();
    } catch (e) {
      console.error("Failed to set mastered:", e);
      new Notice(t("notice_mastery_failed"));
    }
  }

  // ----- 标记忽略 -----
  async setIgnored(key, ignored) {
    try {
      if (ignored) {
        // 1. 清除掌握状态（直接删除，不创建记录）
        if (this.masteryData[key]) {
          delete this.masteryData[key];
        }

        // 2. 写入忽略状态
        if (!this.ignoredData[key]) this.ignoredData[key] = {};
        this.ignoredData[key].ignored = true;
        this.ignoredData[key].updatedAt = this.getLocalDateTimeString();

        // 3. 仅当复习记录存在时才更新等级为5（终止复习）
        const review = this.plugin.studyStore.getReviewByKey(key);
        if (review) {
          await this.plugin.studyStore.setReviewLevel(key, 5);
        }
        // 无记录：不创建，仅保存 ignoredData

      } else {
        // 取消忽略
        if (this.ignoredData[key]) delete this.ignoredData[key];
        await this.plugin.studyStore.setReviewLevel(key, 0);
      }

      await this.saveMastery();
      await this.saveIgnored();
    } catch (e) {
      console.error("Failed to set ignored:", e);
      new Notice(t("notice_ignored_failed"));
    }
  }
}

// ========== 学习进度存储（StudyStore） ==========
class StudyStore {
  constructor(plugin) {
    this.plugin = plugin;
    this.data = null; // { reviews: {}, dailyStats: {}, dailyGoal: 10 }
    this.filePath = "";
  }

  // ----- 获取存储文件路径（插件目录下） -----
  getFilePath() {
    if (!this.filePath) {
      const pluginDir = this.plugin.app.vault.configDir + "/plugins/" + this.plugin.manifest.id + "/";
      this.filePath = normalizePath(pluginDir + "_wordbook_study.json");
    }
    return this.filePath;
  }

  // ----- 加载数据 -----
  async load() {
    const adapter = this.plugin.app.vault.adapter;
    const path = this.getFilePath();
    if (await adapter.exists(path)) {
      try {
        const content = await adapter.read(path);
        this.data = JSON.parse(content);
        if (!this.data.reviews) this.data.reviews = {};
        if (!this.data.dailyStats) this.data.dailyStats = {};
        if (!this.data.dailyGoal) this.data.dailyGoal = this.plugin.settings.study.dailyGoal || 10;
      } catch (e) {
        console.warn("Failed to load study data, initializing defaults", e);
        this.data = { reviews: {}, dailyStats: {}, dailyGoal: this.plugin.settings.study.dailyGoal || 10 };
      }
    } else {
      this.data = { reviews: {}, dailyStats: {}, dailyGoal: this.plugin.settings.study.dailyGoal || 10 };
    }
    this.data.dailyGoal = this.plugin.settings.study.dailyGoal || 10;

    // 数据迁移：为旧数据补全 difficulty 和 consecutive 字段
    for (const key in this.data.reviews) {
      const review = this.data.reviews[key];
      if (review.difficulty === undefined) {
        review.difficulty = 1.0;
      }
      if (review.consecutive === undefined) {
        review.consecutive = { rating: null, count: 0 };
      }
      // 移除废弃的 consecutiveCorrect 字段
      if (review.consecutiveCorrect !== undefined) {
        delete review.consecutiveCorrect;
      }
    }
    await this.save();
  }

  // ----- 保存数据 -----
  async save() {
    const adapter = this.plugin.app.vault.adapter;
    const path = this.getFilePath();
    const dir = path.substring(0, path.lastIndexOf('/'));
    if (dir && !(await adapter.exists(dir))) {
      await adapter.mkdir(dir, { recursive: true });
    }
    await adapter.write(path, JSON.stringify(this.data, null, 2));
  }

  // ----- 获取复习记录的 key -----
  getReviewKey(word, sourceFile) {
    const mode = this.plugin.settings.masteryMode;
    if (mode === "global") {
      return normalizeWord(word);
    } else {
      return `${sourceFile}::${normalizeWord(word)}`; 
    }
  }

  // ----- 获取指定单词的复习记录 -----
  getReview(word, sourceFile) {
    const key = this.getReviewKey(word, sourceFile);
    return this.data.reviews[key] || null;
  }
  getReviewByKey(key) {
    return this.data.reviews[key] || null;
  }

  // ----- 设置/更新复习记录 -----
  setReview(word, sourceFile, reviewData) {
    const key = this.getReviewKey(word, sourceFile);
    this.data.reviews[key] = reviewData;
    this.save();
  }

  // ----- 初始化复习记录（新词） -----
  initReview(word, sourceFile) {
    const key = this.getReviewKey(word, sourceFile);
    if (!this.data.reviews[key]) {
      this.data.reviews[key] = {
        level: 0,
        nextReview: this.getTodayISO(),
        lastReview: null,
        reviewCount: 0,
        firstLearned: this.getTodayISO(),
        difficulty: 1.0,
        consecutive: {
          rating: null,
          count: 0
        }
      };
      this.save();
    }
    return this.data.reviews[key];
  }

  // ----- 本地日期工具方法 -----
  // 获取任意日期的本地日期字符串（YYYY-MM-DD）
  getLocalDateString(date) {
    if (!date) date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 将 "YYYY-MM-DD" 解析为本地时间的 Date 对象（避免 UTC 偏移）
  parseLocalDate(str) {
    if (!str) return new Date();
    const parts = str.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }


  // ----- 获取今天日期的 ISO 字符串 (YYYY-MM-DD) -----
  getTodayISO() {
    return this.getLocalDateString(new Date());
  }

  // ----- 获取今日统计 -----
  getTodayStats() {
    const today = this.getTodayISO();
    if (!this.data.dailyStats[today]) {
      this.data.dailyStats[today] = { reviewed: 0, mastered: 0 };
    }
    return this.data.dailyStats[today];
  }

  // ----- 增加今日复习计数 -----
  incrementReviewed(today = null) {
    const day = today || this.getTodayISO();
    if (!this.data.dailyStats[day]) this.data.dailyStats[day] = { reviewed: 0, mastered: 0 };
    this.data.dailyStats[day].reviewed += 1;
    this.save();
  }

  // ----- 增加今日掌握计数 -----
  incrementMastered(today = null) {
    const day = today || this.getTodayISO();
    if (!this.data.dailyStats[day]) this.data.dailyStats[day] = { reviewed: 0, mastered: 0 };
    this.data.dailyStats[day].mastered += 1;
    this.save();
  }

  // ----- 重置所有进度 -----
  async resetAll() {
    this.data = { reviews: {}, dailyStats: {}, dailyGoal: this.plugin.settings.study.dailyGoal || 10 };
    await this.save();
  }

  // ----- 设置指定单词的复习等级 -----
  async setReviewLevel(key, level) {
    if (!this.data.reviews[key]) {
      // 若不存在记录，创建默认
      this.data.reviews[key] = {
        level: 0,
        nextReview: this.getTodayISO(),
        lastReview: null,
        reviewCount: 0,
        firstLearned: this.getTodayISO(),
        difficulty: 1.0,
        consecutive: {
          rating: null,
          count: 0
        }
      };
    }
    this.data.reviews[key].level = level;

    // 当等级重置为 0 或达到 5（掌握）时，单词评级和计数清零
    if (level === 0 || level >= 5) {
      this.data.reviews[key].consecutive = {
        rating: null,
        count: 0
      };
    }

    if (level >= 5) {
      this.data.reviews[key].nextReview = null;
    } else {
      this.data.reviews[key].nextReview = this.calculateNextReview(level);
    }
    await this.save();
  }

  // ----- 更新难易系数（系数调整 + 连续计数 + 搁置） -----
  updateDifficulty(review, rating) {
    if (!review) return { suspendDays: 0 };

    // 从 settings 获取参数
    const params = this.plugin.settings.studyParams || DEFAULT_SETTINGS.studyParams;

    // 基础系数变化
    let baseDelta = 0;
    switch (rating) {
      case 'again': baseDelta = params.baseDelta?.again ?? -0.12; break;
      case 'hard': baseDelta = params.baseDelta?.hard ?? -0.08; break;
      case 'good': baseDelta = params.baseDelta?.good ?? 0.05; break;
      case 'easy': baseDelta = params.baseDelta?.easy ?? 0.12; break;
      default: return { suspendDays: 0 };
    }

    const isBadGroup = (rating === 'again' || rating === 'hard');
    const isGoodGroup = (rating === 'good' || rating === 'easy');

    // 连续计数
    if (!review.consecutive) {
      review.consecutive = { rating: null, count: 0 };
    }

    const currentGroup = review.consecutive.rating;

    let sameGroup = false;
    if (currentGroup) {
      const currentIsBad = (currentGroup === 'again' || currentGroup === 'hard');
      const currentIsGood = (currentGroup === 'good' || currentGroup === 'easy');
      sameGroup = (isBadGroup && currentIsBad) || (isGoodGroup && currentIsGood);
    }

    if (sameGroup) {
      review.consecutive.count += 1;
    } else {
      review.consecutive.rating = rating;
      review.consecutive.count = 1;
    }

    const count = review.consecutive.count;

    // 额外系数奖励（仅奖励组，且 count >= 3）
    const threshold = params.rewardThreshold ?? 3;
    let extraDelta = 0;
    if (isGoodGroup && count >= threshold) {
      extraDelta = (rating === 'good')
        ? (params.extraDelta?.good ?? 0.05)
        : (params.extraDelta?.easy ?? 0.03);
    }
    // 应用系数变化
    const minDiff = params.difficultyMin ?? 0.7;
    const maxDiff = params.difficultyMax ?? 1.5;
    let newDifficulty = (review.difficulty || 1.0) + baseDelta + extraDelta;
    review.difficulty = Math.max(minDiff, Math.min(maxDiff, newDifficulty));

    // 阈值检查（仅惩罚组）
    let suspendDays = 0;
    if (isBadGroup) {
      const suspendConfig = params.suspend?.[rating] || [];
      const sortedConfig = [...suspendConfig].sort((a, b) => a.threshold - b.threshold);
      for (const entry of sortedConfig) {
        if (count === entry.threshold) {
          suspendDays = entry.days;
          if (entry === sortedConfig[sortedConfig.length - 1]) {
            review.consecutive = { rating: null, count: 0 };
          }
          break;
        }
      }
    }

    return { suspendDays };
  }

  // ----- 从词源独立迁移到全局（合并复习记录，保留最高等级） -----
  async migrateFromPerSourceToGlobal() {
    const allBooks = this.plugin.settings.wordbookFiles
      .filter(b => b.enabled)
      .map(b => b.path);

    // 收集所有词源独立 key 的复习记录
    const globalMerged = {};
    for (const [key, review] of Object.entries(this.data.reviews)) {
      if (key.includes('::')) {
        const word = key.split('::')[1];
        // 如果全局还没有该单词的记录，或者当前记录的等级更高，则保留最高等级
        if (!globalMerged[word] || (review.level || 0) > (globalMerged[word].level || 0)) {
          globalMerged[word] = { ...review };
          // 如果等级达到5，nextReview 应为 null
          if (globalMerged[word].level >= 5) {
            globalMerged[word].nextReview = null;
          }
        }
      }
    }

    // 保留原有的全局 key（不包含 :: 的 key）
    for (const [key, review] of Object.entries(this.data.reviews)) {
      if (!key.includes('::')) {
        // 如果已存在，但新合并的等级更高，则覆盖
        if (globalMerged[key] && (review.level || 0) > (globalMerged[key].level || 0)) {
          globalMerged[key] = { ...review };
        } else if (!globalMerged[key]) {
          globalMerged[key] = { ...review };
        }
      }
    }

    // 替换 reviews 数据
    this.data.reviews = globalMerged;
    await this.save();
  }

  // ----- 从全局迁移到词源独立（复制全局记录到所有词源） -----
  async migrateFromGlobalToPerSource() {
    const allBooks = this.plugin.settings.wordbookFiles
      .filter(b => b.enabled)
      .map(b => b.path);

    if (allBooks.length === 0) return;

    const newReviews = {};
    // 先保留所有不包含 :: 的 key（全局记录）
    for (const [key, review] of Object.entries(this.data.reviews)) {
      if (!key.includes('::')) {
        newReviews[key] = { ...review };
      }
    }

    // 遍历所有全局 key（不包含 ::）
    const globalKeys = Object.keys(this.data.reviews).filter(k => !k.includes('::'));
    for (const word of globalKeys) {
      const review = this.data.reviews[word];
      if (!review) continue;
      for (const bookPath of allBooks) {
        const sourceKey = `${bookPath}::${word}`;
        // 只有目标词源不存在该记录时才创建（不覆盖已有的词源独立记录）
        if (!this.data.reviews[sourceKey]) {
          newReviews[sourceKey] = { ...review };
        }
      }
    }

    // 保留所有现有的词源独立记录
    for (const [key, review] of Object.entries(this.data.reviews)) {
      if (key.includes('::')) {
        newReviews[key] = { ...review };
      }
    }

    this.data.reviews = newReviews;
    await this.save();
  }

  // ----- 根据等级获取间隔天数（SM-2 简化版） -----
  getInterval(level, difficulty = 1.0) {
    if (level >= 5) return 0; // 达到最大等级 -> 掌握
    const defaultIntervals = DEFAULT_SETTINGS.study.intervalDays || [1, 2, 4, 8, 16];
    const userIntervals = this.plugin.settings.study.intervalDays;

    // 如果用户没设置或格式不对，回退到默认
    if (!userIntervals || !Array.isArray(userIntervals) || userIntervals.length < 5) {
      return Math.max(1, Math.round(defaultIntervals[level] * difficulty));
    }

    // 设置的值最小为1（避免 nextReview 变成 null 导致永不出现）
    const val = userIntervals[level];
    const base = (typeof val === 'number' && val > 0) ? val : 1;
    return Math.max(1, Math.round(base * difficulty));
  }

  // ----- 计算下次复习日期 -----
  calculateNextReview(level, fromDate = null, difficulty = 1.0) {
    if (level >= 5) return null; // 掌握
    const interval = this.getInterval(level, difficulty);
    if (interval === 0) return null;
    // 使用 parseLocalDate 安全解析日期字符串
    const date = fromDate ? this.parseLocalDate(fromDate) : new Date();
    date.setDate(date.getDate() + interval);
    return this.getLocalDateString(date);
  }

  // ----- 获取 N 天后的日期字符串 (YYYY-MM-DD) -----
  getDateFromNow(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return this.getLocalDateString(date);
  }

  // 只读统计今日到期单词数
  countDueWords(cards) {
    const today = this.getTodayISO();
    let count = 0;
    for (const card of cards) {
      const key = this.getReviewKey(card.word, card.sourceFile);
      const mastered = this.plugin.masteryStore.isMastered(key);
      const ignored = this.plugin.masteryStore.isIgnored(key);
      if (mastered || ignored) continue;
      const review = this.getReview(card.word, card.sourceFile);
      if (review && review.nextReview && review.nextReview <= today) {
        count++;
      }
    }
    return count;
  }

  // ----- 获取今日应复习的单词列表 -----
  async getDueWords(allCards, limit = 20) {
    const today = this.getTodayISO();
    const due = [];
    const toInit = [];

    // 第一遍：收集已存在且到期的复习记录
    for (const card of allCards) {
      const studyKey = this.getReviewKey(card.word, card.sourceFile);
      // 检查掌握/忽略
      const mastered = this.plugin.masteryStore.isMastered(studyKey);
      const ignored = this.plugin.masteryStore.isIgnored(studyKey);
      if (mastered || ignored) continue;

      const review = this.getReview(card.word, card.sourceFile);
      if (review) {
        if (review.nextReview && review.nextReview <= today) {
          due.push({ card, review });
        }
      } else {
        // 无记录，记录待初始化
        toInit.push(card);
      }
    }

    // 如果到期单词不够 limit，从待初始化中补充
    const need = limit - due.length;
    if (need > 0 && toInit.length > 0) {
      let toInitBatch;

      // 检查用户设置（顺序/乱序）
      const newWordOrder = this.plugin.settings.study.newWordOrder || "sequential";
      if (newWordOrder === "random") {
        // 随机打乱 toInit 数组（Fisher-Yates 洗牌算法）
        const shuffled = [...toInit];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        toInitBatch = shuffled.slice(0, need);
      } else {
        // 按顺序取前 need 个
        toInitBatch = toInit.slice(0, need);
      }

      for (const card of toInitBatch) {
        const key = this.getReviewKey(card.word, card.sourceFile);
        // 直接写入 data.reviews，避免多次 save
        this.data.reviews[key] = {
          level: 0,
          nextReview: today,  // 立即到期
          lastReview: null,
          reviewCount: 0,
          firstLearned: today,
          difficulty: 1.0,
          consecutive: {
            rating: null,
            count: 0
          }
        };
        // 加入 due
        due.push({ card, review: this.data.reviews[key] });
      }
      // 批量保存一次
      await this.save();
    }

    // 根据复习排序设置排序
    const reviewOrder = this.plugin.settings.study.reviewOrder || "due_first";
    if (reviewOrder === "level_low_first") {
      // 低等级优先：等级低的排在前面（升序）
      due.sort((a, b) => (a.review.level || 0) - (b.review.level || 0));
    } else if (reviewOrder === "level_high_first") {
      // 高等级优先：等级高的排在前面（降序）
      due.sort((a, b) => (b.review.level || 0) - (a.review.level || 0));
    } else {
      // 到期优先：下次复习日期越早越优先
      due.sort((a, b) => (a.review.nextReview || '9999-99-99').localeCompare(b.review.nextReview || '9999-99-99'));
    }

    return due.slice(0, limit);
  }
  // ----- 获取统计信息 -----
  getStats(allCards) {
    const total = allCards.length;
    let mastered = 0, ignored = 0, learning = 0;
    let levelCounts = [0, 0, 0, 0, 0, 0]; // 等级0-5
    let sourceCounts = {};
    let colorCounts = {};
    const masteryStore = this.plugin.masteryStore;

    for (const card of allCards) {
      const key = getStudyKey(card.word, card.sourceFile);
      const isMastered = masteryStore.isMastered(key);
      const isIgnored = masteryStore.isIgnored(key);
      if (isMastered) mastered++;
      else if (isIgnored) ignored++;
      else learning++;

      const source = card.sourceFile;
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      const color = card.color || 'default';
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    }

    // 等级分布（只统计学习中【未掌握且未忽略】的单词）
    const reviews = this.data.reviews || {};
    for (const [key, rev] of Object.entries(reviews)) {
      // 检查该词是否已被掌握或忽略
      const isMastered = masteryStore.isMastered(key);
      const isIgnored = masteryStore.isIgnored(key);
      // 跳过已掌握和已忽略的词
      if (isMastered || isIgnored) continue;

      const level = rev.level || 0;
      if (level >= 0 && level <= 5) levelCounts[level]++;
    }

    // 连续学习天数
    let streak = 0;
    const today = this.getTodayISO();
    const todayDate = this.parseLocalDate(today);
    let checkDate = new Date(todayDate);
    checkDate.setDate(checkDate.getDate() - 1); // 从昨天开始

    while (true) {
      const ds = this.getLocalDateString(checkDate);
      if (this.data.dailyStats[ds] && this.data.dailyStats[ds].reviewed > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    // 检查今天是否学习
    const todayStats = this.data.dailyStats[today];
    const hasStudiedToday = todayStats && todayStats.reviewed > 0;
    if (hasStudiedToday) {
      streak = streak + 1;
    }

    // 近30天每日学习活动（用 reviewed 计数作为近似）
    const trend = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = this.getLocalDateString(d);
      trend.push({
        date: key,
        count: this.data.dailyStats[key] ? this.data.dailyStats[key].reviewed : 0
      });
    }

    return {
      total,
      mastered,
      ignored,
      learning,
      levelCounts,
      sourceCounts,
      colorCounts,
      streak,
      trend,
      learningRate: total ? (learning / total * 100) : 0,
      masteredRate: total ? (mastered / total * 100) : 0,
      ignoredRate: total ? (ignored / total * 100) : 0
    };
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
    this._textLayerObserver = null;
    this._intersectionObserver = null;
    this._observedLayers = new WeakSet();
    this._matchCache = new WeakMap();
    this._setupTimer = null;
    this._currentEditorPath = null;   // 缓存当前编辑器的文件路径
  }

  // ---------- 样式辅助 ----------
  getHighlightClasses() {
    const styles = this.plugin.settings.highlightStyles;
    const classes = ['simple-wordbook-highlight'];
    const isTextMode = this.plugin.settings.enableTextColorHighlight;
    const colorNone = this.plugin.settings.highlightColor === "none";

    // 只有当颜色不是 "none" 时，才添加背景或文本类
    if (!colorNone) {
      if (isTextMode) {
        classes.push('hi-text');
      } else {
        classes.push('hi-background');
      }
    }

    // 下划线样式
    const underline = styles.underlineType;
    if (underline === 'solid') classes.push('hi-underline');
    else if (underline === 'dashed') classes.push('hi-dashed');
    else if (underline === 'dotted') classes.push('hi-dotted');
    else if (underline === 'wavy') classes.push('hi-wavy');
    else if (underline === 'double') classes.push('hi-double');

    if (styles.bold) classes.push('hi-bold');
    return classes.join(' ');
  }

  getMainColor(wordColor) {
    if (this.plugin.settings.highlightColor === "none") return "transparent";
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

    const highlight = this.plugin.settings.highlightColor;
    // ↓高亮为"无"时，下划线不回退为透明
    if (highlight === "none") {
      if (this.plugin.settings.followCardColor && wordColor) {
        return `var(--color-${wordColor})`;
      }
      return 'var(--interactive-accent)';
    }
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

    // 根目录通配符 *
    const hasRootWildcard = scopePaths.includes('*');
    if (hasRootWildcard) {
      const isRootFile = !normalizedPath.includes('/');
      if (isRootFile) {
        return scopeMode === "include";
      }
    }

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

    // 清空匹配缓存（词库变化后旧缓存无效）
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

      // 如果仍然没有路径，但容器是可见的阅读视图，则使用活动文件路径
      if (!path) {
        // 检查容器是否可见（在视口中或部分可见）
        const rect = container.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0 &&
          rect.bottom >= -200 && rect.top <= window.innerHeight + 200;
        if (isVisible) {
          // 如果容器可见，并且是当前活动文件（阅读模式），则使用活动文件路径
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
          phonetic: c.phonetic,
          lang: c.lang || ""
        }));
        span.setAttribute('data-cards', JSON.stringify(cardsData));
        span.setAttribute('data-current-source', selectedCard.sourceFile);
        const mainColor = this.getMainColor(selectedCard.color);
        const underlineColor = this.getUnderlineColor(selectedCard.color);
        span.style.setProperty('--word-highlight-color', mainColor);
        span.style.setProperty('--word-underline-color', underlineColor);
        span.style.setProperty('--highlight-opacity', this.plugin.settings.mdHighlightOpacity + '%');
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

        // 优先获取编辑器自身的文件路径
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
          phonetic: c.phonetic,
          lang: c.lang || ""
        }));
        builder.add(from, to, Decoration.mark({
          class: this.getHighlightClasses(),
          attributes: {
            'data-word': selectedCard.word,
            'data-definition': (selectedCard.definition || "").replace(/"/g, '&quot;'),
            'data-source': selectedCard.sourceFile,
            'data-cards': JSON.stringify(cardsData),
            'data-current-source': selectedCard.sourceFile,
            'style': `--word-highlight-color: ${mainColor}; --word-underline-color: ${underlineColor}; --highlight-opacity: ${this.plugin.settings.mdHighlightOpacity}%;`
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

    // 监听活动叶子切换事件（包括编辑器焦点切换）
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
    // 垂直方向缓冲 100% 视口高度，水平方向缓冲 50% 视口宽度
    const bufferV = windowHeight * 1;
    const bufferH = windowWidth * 0.5;
    return rect.bottom >= -bufferV && rect.top <= windowHeight + bufferV &&
      rect.right >= -bufferH && rect.left <= windowWidth + bufferH;
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

    // 正确计算实际缩放因子（视口尺寸 / 布局尺寸）
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
      // PDF 高亮强制使用背景模式（不跟随文本颜色高亮开关）
      let pdfClasses = 'simple-wordbook-pdf-highlight';
      if (this.plugin.settings.highlightColor !== "none") {
        pdfClasses += ' hi-background';
      }
      span.className = pdfClasses;

      span.setAttribute('data-cards', JSON.stringify(cardsData));
      span.setAttribute('data-current-source', selectedCard.sourceFile);
      span.style.setProperty('--word-highlight-color', mainColor);
      span.style.setProperty('--word-underline-color', this.getUnderlineColor(selectedCard.color));
      span.style.setProperty('--highlight-opacity', this.plugin.settings.pdfHighlightOpacity + '%');

      // 将视口坐标转换为布局坐标（除以缩放因子）
      const leftPx = (rect.left - layerRect.left) / scaleX + layer.scrollLeft;
      const topPx = (rect.top - layerRect.top) / scaleY + layer.scrollTop + 1;// 高度偏移微调
      const widthPx = (rect.right - rect.left) / scaleX;
      const heightPx = (rect.bottom - rect.top) / scaleY; 

      span.style.position = 'absolute';
      span.style.left = `${leftPx}px`;
      span.style.top = `${topPx}px`;
      span.style.width = `${widthPx}px`;
      span.style.height = `${Math.max(0, heightPx * 0.9)}px`; // 高度微调
      span.style.boxSizing = 'border-box';
      span.style.padding = '0';
      span.style.margin = '0';
      span.style.lineHeight = '1';
      span.style.pointerEvents = 'auto';
      span.style.cursor = 'pointer';
      span.style.zIndex = '10';
      
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

    // 创建一个 DocumentFragment 作为所有新高亮的容器
    const allHighlightsFragment = document.createDocumentFragment();

    // 获取视口尺寸用于过滤 span
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spans = layer.querySelectorAll('span[role="presentation"]');
    for (const span of spans) {
      // 获取当前 span 的位置信息
      const spanRect = span.getBoundingClientRect();

      // 垂直缓冲 50% 视口高度，水平缓冲 10% 视口宽度
      const spanBufferV = viewportHeight * 0.5;
      const spanBufferH = viewportWidth * 0.1;
      if (spanRect.bottom < -spanBufferV || spanRect.top > viewportHeight + spanBufferV ||
        spanRect.right < -spanBufferH || spanRect.left > viewportWidth + spanBufferH) {
        continue;
      }

      const text = span.textContent;
      if (!text || !text.trim()) continue;

      // 使用缓存匹配结果（避免重复 Trie 查找）
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
        if (fragment) {
          allHighlightsFragment.appendChild(fragment);
        }
      }
    }
    // 所有高亮元素组装完毕后，一次性插入 DOM
    if (allHighlightsFragment.hasChildNodes()) {
      layer.appendChild(allHighlightsFragment);
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
      rootMargin: '100%', // 提前加载临近区域，减少滚动时的等待
      threshold: 0.05      // 只要 5% 可见即触发
    });

    // 观察所有现有的 textLayer
    const textLayers = document.querySelectorAll('.pdf-container .textLayer, .mod-pdf .textLayer');
    for (const layer of textLayers) {
      if (layer.isConnected) {
        this._intersectionObserver.observe(layer);
      }
    }
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

    // 对于已经在视口中的层，立即高亮（避免等待滚动）
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
      let newLayers = [];
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 检查是否是新 textLayer 或包含 textLayer
              let layer = null;
              if (node.classList && node.classList.contains('textLayer')) {
                layer = node;
              } else {
                layer = node.querySelector('.textLayer');
              }
              if (layer) {
                newLayers.push(layer);
              }
            }
          }
        }
      }
      if (newLayers.length > 0) {
        // 立即处理新 layer
        for (const layer of newLayers) {
          // 加入 IntersectionObserver（如果已存在）
          if (this._intersectionObserver && layer.isConnected) {
            this._intersectionObserver.observe(layer);
            if (!this._observedLayers) this._observedLayers = new WeakSet();
            this._observedLayers.add(layer);
          }
          // 如果当前可见，立即高亮
          if (this.isElementVisible(layer)) {
            this.highlightPDFLayer(layer);
          }
        }
        // 同时刷新所有已观察层（确保整体一致）
        this.applyToPDFs(0);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    this.pdfObserver = observer;

    // 保存定时器 ID
    this._setupTimer = setTimeout(() => this._setupPDFScrollListeners(), 200);
    return observer;
  }

  cleanupPDFListeners() {
    // 清除延迟设置的定时器
    if (this._setupTimer) {
      clearTimeout(this._setupTimer);
      this._setupTimer = null;
    }

    // 清理文本层观察者
    if (this._textLayerObserver) {
      this._textLayerObserver.disconnect();
      this._textLayerObserver = null;
    }

    // 清理 IntersectionObserver
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
      this._intersectionObserver = null;
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


// ---------- 根据当前固定的 top 值，动态设置弹窗最大高度 ----------
  _applyMaxHeight(tooltip) {
    if (this._fixedTop === null) return;
    const cssMax = 400; // 与 CSS 中的 max-height 保持一致
    const remaining = window.innerHeight + window.scrollY - this._fixedTop - 10; // 10px 底部边距
    const dynamicMax = Math.min(cssMax, Math.max(200, remaining)); // 至少 200px
    tooltip.style.maxHeight = dynamicMax + 'px';
  }


  // ---------- 重新定位弹窗（仅修正水平位置，并刷新最大高度） ----------
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
    // 清除可能残留的关闭定时器
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
      sections = [{ title: t("section_default_title"), content: currentCard?.definition || "" }];
    }

    const tooltip = document.createElement("div");
    tooltip.className = "simple-wordbook-tooltip";

    tooltip.dataset.lang = currentCard.lang || this.plugin.settings.defaultLanguage || 'en';

    if (this.plugin.settings.enableBlurDefinition) {
      tooltip.classList.add("blur-definition");
    }

    const titleDiv = tooltip.createDiv({ cls: "tooltip-title" });
    const wordSpan = titleDiv.createSpan({ cls: "word", text: word });
    wordSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      playPronunciation(
        word,
        this.plugin.settings.ttsUrlTemplate,
        this.plugin.settings.pronunciationVariant,
        currentCard.lang
      );
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
    }

    const contentDiv = tooltip.createDiv({ cls: "tooltip-content" });
    let activeSectionIndex = 0;

    const renderContent = async (index) => {
      contentDiv.empty();
      const section = sections[index];
      if (section) {
        let content = section.content;
        if (index === 0 && currentCard?.phonetic) {
          const phoneticHtml = `<span class="tooltip-phonetic">${currentCard.phonetic}</span>`;
          content = `${phoneticHtml}\n\n${content}`;
        }
        const processed = processLineBreaks(content);
        // 等待渲染完成
        await MarkdownRenderer.render(this.plugin.app, processed, contentDiv, currentCard.sourceFile, this.plugin);
        // 修复内部链接
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

    const fromLabel = footerDiv.createSpan({ cls: "tooltip-from-label", text: "from" });

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

    // 记录固定 top，并应用最大高度
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
  // 用于分批渲染的定时器句柄
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
    this.foldState = new Map();
  }
  getViewType() { return VIEW_TYPE_SIDEBAR; }
  getDisplayText() { return t("sidebar_title"); }
  getIcon() { return "notepad-text"; }
  async onOpen() {
    this.containerEl.empty();
    this.containerEl.addClass("simple-wordbook-sidebar");
    this.registerEvent(this.plugin.app.workspace.on("file-open", () => this.refresh()));
    this.registerEvent(this.plugin.app.workspace.on("simple-wordbook:data-updated", () => this.refresh()));
    // 监听高亮刷新事件，仅 PDF 时刷新
    this.registerEvent(this.plugin.app.workspace.on("simple-wordbook:highlighter-updated", () => {
      const activeFile = this.plugin.app.workspace.getActiveFile();
      if (activeFile && activeFile.extension === "pdf") {
        this.debouncedRefresh();
      }
    }));
    this._lastFoldEnabled = this.plugin.settings.enableFoldDefinition;
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
    // 检测折叠开关是否发生变化，若变化则清空所有折叠状态
    const currentFoldEnabled = this.plugin.settings.enableFoldDefinition;
    if (this._lastFoldEnabled !== undefined && this._lastFoldEnabled !== currentFoldEnabled) {
      this.foldState.clear();
    }
    this._lastFoldEnabled = currentFoldEnabled;

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

    // 清理不再存在的卡片折叠状态
    const validKeys = new Set(this.currentFileWords.map(w => w.studyKey));
    for (const key of this.foldState.keys()) {
      if (!validKeys.has(key)) {
        this.foldState.delete(key);
      }
    }
  }

  // PDF提取改用轮询
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

    // 清理无效折叠状态
    const currentKeys = new Set(this.currentFileWords.map(w => w.studyKey));
    for (const key of this.foldState.keys()) {
      if (!currentKeys.has(key)) {
        this.foldState.delete(key);
      }
    }

    // 清除旧的渲染定时器，防止冲突
    if (this._renderTimer) {
      clearTimeout(this._renderTimer);
      this._renderTimer = null;
    }

    const searchDiv = container.createDiv({ cls: "sidebar-search" });
    const searchInput = searchDiv.createEl("input", { type: "text", placeholder: t("search_placeholder") });
    searchInput.value = this.searchQuery;

    // ----- 搜索输入事件 -----
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      this.searchQuery = query;

      if (query) {
        // 按优先级查找匹配的卡片所在的标签页
        let targetTab = null;
        const tabOrder = ['learning', 'mastered', 'ignored'];

        for (const tab of tabOrder) {
          let cardsInTab;
          if (tab === 'learning') {
            cardsInTab = this.currentFileWords.filter(w => !w.mastered && !w.ignored);
          } else if (tab === 'mastered') {
            cardsInTab = this.currentFileWords.filter(w => w.mastered);
          } else {
            cardsInTab = this.currentFileWords.filter(w => w.ignored);
          }

          const hasMatch = cardsInTab.some(w =>
            w.word.toLowerCase().includes(query) ||
            (w.aliases && w.aliases.some(a => a.toLowerCase().includes(query)))
          );

          if (hasMatch) {
            targetTab = tab;
            break;
          }
        }

        if (targetTab && targetTab !== this.activeTab) {
          // 切换到匹配的标签页（内部会触发过滤和渲染）
          this.switchTab(targetTab);
          return; // switchTab 已处理所有更新
        }

        // 没有匹配的卡片，或目标标签页就是当前标签页 → 正常过滤
        this.filterWords();
        this.updateCardVisibility();
        this._scheduleBatchRendering(this.filteredWords);
      } else {
        // 搜索词为空 → 显示当前标签页的所有卡片
        this.filterWords();
        this.updateCardVisibility();
        this._scheduleBatchRendering(this.filteredWords);
      }
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

    // 第一轮只建DOM骨架，不渲染Markdown
    for (const word of this.currentFileWords) {
      const card = this.createWordCard(word, this.listContainer);
      this.cardCache.set(word.studyKey, card);
    }
    this.updateCardVisibility();
    this.updateTabCounts = updateTabCounts;

    // 第二轮分批异步渲染释义（首批10个立即显示）
    this._scheduleBatchRendering(this.filteredWords);
  }

  switchTab(tabId) {
    if (this.activeTab === tabId) return;
    this.activeTab = tabId;
    this.filterWords();
    this.updateCardVisibility();
    if (this.updateTabCounts) this.updateTabCounts();
    // 触发新标签页中卡片的渲染
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

  // createWordCard只建骨架，挂载元数据
  createWordCard(wordObj, container) {
    const cardDiv = container.createDiv({ cls: "word-card" });
    const colorMap = {
      red: "var(--color-red)",
      orange: "var(--color-orange)",
      yellow: "var(--color-yellow)",
      green: "var(--color-green)",
      blue: "var(--color-blue)",
      purple: "var(--color-purple)",
      pink: "var(--color-pink)",
      cyan: "var(--color-cyan)"
    };
    cardDiv.style.setProperty("--card-color", colorMap[wordObj.color] || "var(--interactive-accent)");

    cardDiv.dataset.lang = wordObj.lang || this.plugin.settings.defaultLanguage || 'en';

    const actionsDiv = cardDiv.createDiv({ cls: "card-actions" });
    if (this.plugin.settings.enableMastery) {
      const masteryBtn = actionsDiv.createDiv({ cls: "action-icon" });
      setIcon(masteryBtn, wordObj.mastered ? "meh" : "smile");
      masteryBtn.classList.add(wordObj.mastered ? "icon-meh" : "icon-smile");
      masteryBtn.setAttribute("title", wordObj.mastered ? t("notice_mastery_label_on") : t("notice_mastery_label_off"));
      masteryBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const newState = !wordObj.mastered;
        await this.plugin.masteryStore.setMastered(wordObj._stateKey, newState);
        await this.plugin.highlighter.refresh();
        this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
        await this.refresh();
      });

      const ignoreBtn = actionsDiv.createDiv({ cls: "action-icon" });
      setIcon(ignoreBtn, wordObj.ignored ? "eye-off" : "eye");
      ignoreBtn.classList.add(wordObj.ignored ? "icon-eye-off" : "icon-eye");
      ignoreBtn.setAttribute("title", wordObj.ignored ? t("notice_ignored_label_on") : t("notice_ignored_label_off"));
      ignoreBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const newIgnore = !wordObj.ignored;
        await this.plugin.masteryStore.setIgnored(wordObj._stateKey, newIgnore);
        await this.plugin.highlighter.refresh();
        this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
        await this.refresh();
      });
    }

    const wordLine = cardDiv.createDiv({ cls: "word-line" });

    // ---- 折叠按钮（在单词前面） ----
    const foldBtn = wordLine.createSpan({ cls: "fold-btn" });

    // 单词
    const wordSpan = wordLine.createSpan({ cls: "word", text: wordObj.word });
    wordSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      playPronunciation(
        wordObj.word,
        this.plugin.settings.ttsUrlTemplate,
        this.plugin.settings.pronunciationVariant,
        wordObj.lang
      );
    });

    // 添加右键复制菜单
    wordSpan.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      new WordCopyMenu(this.plugin, wordObj).showAtMouseEvent(e);
    });

    // 释义区域
    const defDiv = cardDiv.createDiv({ cls: "definition" });

    // 根据设置决定是否显示折叠按钮及初始状态
    const foldEnabled = this.plugin.settings.enableFoldDefinition;
    const studyKey = wordObj.studyKey;

    // 从缓存读取折叠状态
    let isFolded;
    if (foldEnabled) {
      const cached = this.foldState.get(studyKey);
      isFolded = (cached !== undefined) ? cached : true; // 默认折叠
      this.foldState.set(studyKey, isFolded);  // 启用时写入缓存
    } else {
      isFolded = false; // 功能关闭时展开
      this.foldState.delete(studyKey); // 清除该卡片的缓存
    }

    // 设置折叠按钮外观
    if (foldEnabled) {
      setIcon(foldBtn, isFolded ? "chevron-right" : "chevron-down");
      foldBtn.style.display = "inline-flex";
    } else {
      foldBtn.style.display = "none";
    }

    // 点击切换折叠状态
    foldBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isFolded = !isFolded;
      this.foldState.set(studyKey, isFolded); // 更新缓存
      setIcon(foldBtn, isFolded ? "chevron-right" : "chevron-down");
      defDiv.style.display = isFolded ? "none" : "block";
    });

    // 应用初始折叠状态
    defDiv.style.display = isFolded ? "none" : "block";

    if (this.plugin.settings.enableBlurDefinition) defDiv.classList.add("blur");

    const sections = wordObj.sections || [{ title: t("section_default_title"), content: wordObj.definition || "" }];
    const hasMultipleSections = sections.length > 1;
    let tabBar = null;
    if (hasMultipleSections) {
      tabBar = defDiv.createDiv({ cls: "word-card-tab-bar" });
    }

    // 内容容器先占位
    const contentContainer = defDiv.createDiv({ cls: "word-card-content" });
    contentContainer.setText(t("notice_loading_definition"));

    // 挂载元数据供后续 _renderCardContent 使用
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

  // 分批渲染调度器（每批10个）
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

  // 实际渲染单个卡片的释义和标签
  async _renderCardContent(card) {
    // 防止重复渲染，如果已经渲染过则跳过
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
        if (index === 0 && wordObj.phonetic) {
          const phoneticHtml = `<span class="card-phonetic">${wordObj.phonetic}</span>`;
          content = `${phoneticHtml}\n\n${content}`;
        }
        const processed = processLineBreaks(content);
        // 等待渲染完成
        await MarkdownRenderer.render(this.plugin.app, processed, contentContainer, wordObj.sourceFile, this.plugin);
        // 修复内部链接
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
    // 0. 先清除搜索框内容（让所有卡片可见）
    const searchInput = this.containerEl?.querySelector('.sidebar-search input');
    if (searchInput) {
      searchInput.value = "";
    }
    this.searchQuery = "";

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
    this.currentMode = "local";
  }

  getViewType() { return VIEW_TYPE_LOOKUP; }
  getDisplayText() { return t("lookup_view_title"); }
  getIcon() { return "book-search"; }

  async onOpen() {
    this.containerEl.empty();
    this.containerEl.addClass("simple-wordbook-lookup-panel");
    this.buildUI();
    this.refreshPromptSelect();

    // 监听数据更新事件，自动刷新查词结果
    this.registerEvent(this.plugin.app.workspace.on("simple-wordbook:data-updated", () => {
      // 仅在本地模式下自动刷新
      if (this.currentWord && this.searchInput && this.currentMode === "local") {
        this.doLocalLookup(this.currentWord);
      }
    }));

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

  // 刷新视图
  async refresh() {
    // 清空并重建 UI
    this.containerEl.empty();
    this.buildUI();
    this.refreshPromptSelect();
  }

  buildUI() {
    const container = this.containerEl;

    // 输入行（输入框 + 清空按钮）
    const inputRow = container.createDiv({ cls: "lookup-input-row" });
    const searchInput = inputRow.createEl("input", { type: "text", placeholder: t("lookup_input_placeholder") });

    searchInput.addEventListener("keydown", (e) => {
      const word = searchInput.value;

      // Shift + Enter → 强制 AI 查询
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();  // 防止触发默认行为
        if (word && word.trim()) {
          this.doAILookup(word);
        } else {
          new Notice(t("lookup_empty_word"));
        }
        return;
      }

      // Enter → 根据模式查询
      if (e.key === "Enter") {
        const mode = this.plugin.settings.enterMode || "local_first";
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
    const colorMap = {
      red: "var(--color-red)",
      orange: "var(--color-orange)",
      yellow: "var(--color-yellow)",
      green: "var(--color-green)",
      blue: "var(--color-blue)",
      purple: "var(--color-purple)",
      pink: "var(--color-pink)",
      cyan: "var(--color-cyan)"
    };
    cardDiv.style.setProperty("--card-color", colorMap[card.color] || "var(--interactive-accent)");

    cardDiv.dataset.lang = card.lang || this.plugin.settings.defaultLanguage || 'en';

    // 操作按钮（掌握/忽略）
    const actionsDiv = cardDiv.createDiv({ cls: "card-actions" });
    if (this.plugin.settings.enableMastery) {
      const masteryBtn = actionsDiv.createDiv({ cls: "action-icon" });
      const isMastered = this.plugin.masteryStore.isMastered(card._stateKey || card.word);
      setIcon(masteryBtn, isMastered ? "meh" : "smile");
      masteryBtn.classList.add(isMastered ? "icon-meh" : "icon-smile");
      masteryBtn.setAttribute("title", isMastered ? t("notice_mastery_label_on") : t("notice_mastery_label_off"));
      masteryBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const newState = !isMastered;
        await this.plugin.masteryStore.setMastered(card._stateKey || card.word, newState);
        await this.plugin.highlighter.refresh();
        this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
        this.doLocalLookup(this.currentWord);
      });

      const ignoreBtn = actionsDiv.createDiv({ cls: "action-icon" });
      const isIgnored = this.plugin.masteryStore.isIgnored(card._stateKey || card.word);
      setIcon(ignoreBtn, isIgnored ? "eye-off" : "eye");
      ignoreBtn.classList.add(isIgnored ? "icon-eye-off" : "icon-eye");
      ignoreBtn.setAttribute("title", isIgnored ? t("notice_ignored_label_on") : t("notice_ignored_label_off"));
      ignoreBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const newIgnore = !isIgnored;
        await this.plugin.masteryStore.setIgnored(card._stateKey || card.word, newIgnore);
        await this.plugin.highlighter.refresh();
        this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
        this.doLocalLookup(this.currentWord);
      });
    }

    // 单词行
    const wordLine = cardDiv.createDiv({ cls: "word-line" });

    // ---- 折叠按钮（在单词前面） ----
    const foldBtn = wordLine.createSpan({ cls: "fold-btn" });
    foldBtn.addEventListener("mouseenter", () => { foldBtn.style.opacity = "1"; });
    foldBtn.addEventListener("mouseleave", () => { foldBtn.style.opacity = "0.6"; });

    const foldEnabled = this.plugin.settings.enableFoldDefinition;
    let isFolded = foldEnabled;

    if (foldEnabled) {
      setIcon(foldBtn, "chevron-right");
    } else {
      foldBtn.style.display = "none";
    }

    foldBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isFolded = !isFolded;
      setIcon(foldBtn, isFolded ? "chevron-right" : "chevron-down");
      defDiv.style.display = isFolded ? "none" : "block";
    });

    const wordSpan = wordLine.createSpan({ cls: "word", text: card.word });
    wordSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      playPronunciation(
        card.word,
        this.plugin.settings.ttsUrlTemplate,
        this.plugin.settings.pronunciationVariant,
        card.lang
      );
    });

    // 添加右键复制菜单
    wordSpan.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      new WordCopyMenu(this.plugin, card).showAtMouseEvent(e);
    });

    // 显示匹配程度标签
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
    // 如果启用折叠且当前为折叠状态，隐藏 defDiv
    if (foldEnabled && isFolded) {
      defDiv.style.display = "none";
    }
    if (this.plugin.settings.enableBlurDefinition) defDiv.classList.add("blur");

    const sections = card.sections || [{ title: t("section_default_title"), content: card.definition || "" }];
    const hasMultipleSections = sections.length > 1;
    let tabBar = null;
    if (hasMultipleSections) {
      tabBar = defDiv.createDiv({ cls: "word-card-tab-bar" });
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

    // 添加右键菜单
    cardDiv.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      new WordContextMenu(this.plugin, card).showAtMouseEvent(e);
    });

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
        if (index === 0 && wordObj.phonetic) {
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
    this.currentMode = "local";
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
    this.currentMode = "ai";
    this.currentWord = word.trim();
    const promptName = this.promptSelect ? this.promptSelect.value : "默认";
    this.currentPromptName = promptName;

    // 声明 systemName
    let systemName = "";

    // 获取提示词内容
    let promptContent;
    if (promptName === "默认") {
      promptContent = this.plugin.settings.defaultPrompt || "请解释单词 {word}";
      systemName = this.plugin.settings.defaultSystemPrompt || "";
    } else {
      const custom = this.plugin.settings.customPrompts.find(p => p.name === promptName);
      promptContent = custom ? custom.content : this.plugin.settings.defaultPrompt;
      systemName = custom ? custom.system_prompt || "" : "";
    }
    if (!promptContent) {
      new Notice(t("notice_prompt_empty"));
      return;
    }
    const finalPrompt = promptContent.replace(/{word}/g, this.currentWord);

    // 获取系统提示词内容
    let systemContent = null;
    if (systemName) {
      systemContent = getSystemPromptContent(systemName, this.plugin.settings);
    }

    this.setLoading(true);
    this.resultContainer.empty();
    this.resultContainer.setText(t("lookup_loading"));

    try {
      const response = await this.plugin.callAI(finalPrompt, systemContent);
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

  // 从文本中提取音标（支持多种格式）
  extractPhonetic(text) {
    // 匹配方括号或斜杠包裹的音标
    const phoneticRegex = /\[[^\]]+\]|\/[^\/]+\//g;
    const labelSet = ['英', '美', 'UK', 'US', 'BrE', 'AmE', 'Br', 'Am', '英式', '美式', '英音', '美音', 'British', 'American'];
    // 添加 'g' 标志以支持 matchAll
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
    };
    const modal = new WordModal(this.plugin.app, this.plugin, card);
    modal.open();
  }
}

// ========== 词库管理视图 ==========
class LibraryView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    // 数据
    this.allCards = [];
    this.filteredCards = [];
    // 状态
    this.searchQuery = "";
    this.filterColor = "all";
    this.filterStatus = "all"; // "all", "learning", "mastered", "ignored"
    this.filterSource = "all";
    this.sortField = "word"; // "word", "status", "color", "source"
    this.sortAsc = true;
    this.selectedRows = new Set(); // 存储 card 的唯一标识（word+source 或 studyKey）
    // 渲染相关
    this.renderStart = 0;
    this.renderCount = 50; // 每页行数
    this.rowHeight = 36;  // 每行高度（px）
    this.totalRows = 0;
    this.container = null;
    this.tableBody = null;
    this.scrollContainer = null;
    this._scrollListener = null;
    this._resizeObserver = null;
    this.rowElements = [];
  }

  getViewType() { return VIEW_TYPE_LIBRARY; }
  getDisplayText() { return t("library_view_title"); }
  getIcon() { return "library-big"; }

  async onOpen() {
    this.containerEl.empty();
    this.containerEl.addClass("simple-wordbook-library");
    this.buildUI();
    await this.loadData();
    this.render();
    this.registerEvent(this.plugin.app.workspace.on("simple-wordbook:data-updated", () => this.loadDataAndRender()));
    this.registerEvent(this.plugin.app.vault.on("modify", (file) => {
      if (file instanceof TFile && file.extension === "json") {
        const isWordbook = this.plugin.settings.wordbookFiles.some(wb => wb.path === file.path);
        if (isWordbook) this.loadDataAndRender();
      }
    }));
  }

  // 刷新视图
  async refresh() {
    // 清空并重建 UI
    this.containerEl.empty();
    this.buildUI();
    await this.loadData();
    this.render();
  }

  onClose() {
    if (this._scrollListener) {
      this.scrollContainer?.removeEventListener("scroll", this._scrollListener);
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  // ---------- UI 构建 ----------
  buildUI() {
    const container = this.containerEl;
    // 顶部工具栏
    const toolbar = container.createDiv({ cls: "library-toolbar" });
    const searchInput = toolbar.createEl("input", { type: "text", placeholder: t("library_search_placeholder") });
    searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.filterData();
      this.render();
    });

    // 筛选：颜色
    const colorFilter = toolbar.createEl("select");
    colorFilter.add(new Option(t("library_filter_color_all"), "all"));
    const colors = ["", "red", "orange", "yellow", "green", "blue", "purple", "pink", "cyan"];
    for (const c of colors) {
      const label = c ? t("color_" + c) : t("library_filter_color_default");
      colorFilter.add(new Option(label, c || "default"));
    }
    colorFilter.value = this.filterColor;
    colorFilter.addEventListener("change", (e) => {
      this.filterColor = e.target.value;
      this.filterData();
      this.render();
    });

    // 筛选：状态
    const statusFilter = toolbar.createEl("select");
    statusFilter.add(new Option(t("library_filter_status_all"), "all"));
    statusFilter.add(new Option(t("library_filter_status_learning"), "learning"));
    statusFilter.add(new Option(t("library_filter_status_mastered"), "mastered"));
    statusFilter.add(new Option(t("library_filter_status_ignored"), "ignored"));
    statusFilter.value = this.filterStatus;
    statusFilter.addEventListener("change", (e) => {
      this.filterStatus = e.target.value;
      this.filterData();
      this.render();
    });

    // 筛选：来源
    const sourceFilter = toolbar.createEl("select");
    sourceFilter.add(new Option(t("library_filter_source_all"), "all"));
    this.sourceFilter = sourceFilter;
    sourceFilter.addEventListener("change", (e) => {
      this.filterSource = e.target.value;
      this.filterData();
      this.render();
    });

    // 排序
    const sortSelect = toolbar.createEl("select");
    sortSelect.add(new Option(t("library_sort_field_word"), "word"));
    sortSelect.add(new Option(t("library_sort_field_status"), "status"));
    sortSelect.add(new Option(t("library_sort_field_color"), "color"));
    sortSelect.add(new Option(t("library_sort_field_source"), "source"));
    sortSelect.value = this.sortField;
    sortSelect.addEventListener("change", (e) => {
      this.sortField = e.target.value;
      this.filterData();
      this.render();
    });

    // 排序方向按钮
    const sortDirBtn = toolbar.createEl("button", { title: t("library_sort_toggle") });

    const updateSortIcon = () => {
      setIcon(sortDirBtn, this.sortAsc ? "arrow-up" : "arrow-down");
    };
    updateSortIcon();

    sortDirBtn.addEventListener("click", () => {
      this.sortAsc = !this.sortAsc;
      updateSortIcon();
      this.filterData();
      this.render();
    });

    // 全选按钮
    const selectAllBtn = toolbar.createEl("button", { title: t("library_select_all_title") });

    const updateSelectAllIcon = () => {
      const total = this.filteredCards.length;
      const isAllSelected = total > 0 && this.selectedRows.size === total;
      setIcon(selectAllBtn, isAllSelected ? "check-square" : "square");
    };
    updateSelectAllIcon();

    selectAllBtn.addEventListener("click", () => {
      const total = this.filteredCards.length;
      if (total === 0) return;
      if (this.selectedRows.size === total) {
        this.selectedRows.clear();
      } else {
        for (const card of this.filteredCards) {
          this.selectedRows.add(card._uid);
        }
      }
      updateSelectAllIcon();
      this.updateBatchBar();
      this.render();
    });

    // 批量操作栏
    const batchBar = container.createDiv({ cls: "library-batch-bar" });
    batchBar.style.display = "none";
    const batchInfo = batchBar.createSpan({ cls: "batch-info" });
    const batchColor = batchBar.createEl("select");
    batchColor.add(new Option(t("library_batch_color"), ""));
    const colorOpts = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "cyan", "default"];
    for (const c of colorOpts) {
      const label = c === "default" ? t("library_filter_color_default") : t("color_" + c);
      batchColor.add(new Option(label, c));
    }
    batchColor.addEventListener("change", async (e) => {
      const val = e.target.value;
      if (!val) return;
      await this.batchSetColor(val);
      batchColor.value = "";
    });

    const batchMastery = batchBar.createEl("button", { text: t("library_batch_mastered") });
    batchMastery.addEventListener("click", () => this.batchSetMastered(true));
    const batchUnmaster = batchBar.createEl("button", { text: t("library_batch_unmaster") });
    batchUnmaster.addEventListener("click", () => this.batchSetMastered(false));
    const batchIgnore = batchBar.createEl("button", { text: t("library_batch_ignore") });
    batchIgnore.addEventListener("click", () => this.batchSetIgnored(true));
    const batchUnignore = batchBar.createEl("button", { text: t("library_batch_unignore") });
    batchUnignore.addEventListener("click", () => this.batchSetIgnored(false));
    const batchDelete = batchBar.createEl("button", { text: t("library_batch_delete"), cls: "mod-warning" });
    batchDelete.addEventListener("click", () => this.batchDelete());
    const batchClear = batchBar.createEl("button", { text: t("library_batch_clear") });
    batchClear.addEventListener("click", () => { this.selectedRows.clear(); this.updateBatchBar(); this.render(); });

    // 统计栏
    const statsBar = container.createDiv({ cls: "library-stats" });
    this.statsBar = statsBar;

    // 表格容器
    const tableWrapper = container.createDiv({ cls: "library-table-wrapper" });
    this.scrollContainer = tableWrapper;
    const table = tableWrapper.createEl("table");
    table.className = "library-table";
    // 表头
    const thead = table.createEl("thead");
    const headerRow = thead.createEl("tr");
    headerRow.createEl("th", { text: t("library_table_header_select") });
    headerRow.createEl("th", { text: t("library_table_header_word") });
    headerRow.createEl("th", { text: t("library_table_header_phonetic") });
    headerRow.createEl("th", { text: t("library_table_header_definition") });
    headerRow.createEl("th", { text: t("library_table_header_source") });
    headerRow.createEl("th", { text: t("library_table_header_color") });
    headerRow.createEl("th", { text: t("library_table_header_status") });
    // 表体
    const tbody = table.createEl("tbody");
    this.tableBody = tbody;
    // 保存引用
    this.searchInput = searchInput;
    this.colorFilter = colorFilter;
    this.statusFilter = statusFilter;
    this.sourceFilter = sourceFilter;
    this.sortSelect = sortSelect;
    this.batchBar = batchBar;
    this.batchInfo = batchInfo;

    this._scrollListener = () => this.onScroll();
    tableWrapper.addEventListener("scroll", this._scrollListener);

    // 防抖版 ResizeObserver
    let resizeTimer = null;
    this._resizeObserver = new ResizeObserver(() => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        this.render();
        resizeTimer = null;
      });
    });
    this._resizeObserver.observe(tableWrapper);
  }

  // ---------- 数据加载 ----------
  async loadData() {
    const all = this.plugin.getAllCards();
    const mastery = this.plugin.masteryStore;
    const mode = this.plugin.settings.masteryMode;
    for (const card of all) {
      const key = mode === "global" ? card.word.toLowerCase() : `${card.sourceFile}::${card.word.toLowerCase()}`;
      card._mastered = mastery.isMastered(key);
      card._ignored = mastery.isIgnored(key);
      card._stateKey = key;
      card._uid = `${card.sourceFile}::${card.word}`;
    }
    this.allCards = all;
    // 更新来源下拉
    const sources = [...new Set(all.map(c => c.sourceFile))];
    this.sourceFilter.innerHTML = `<option value="all">${t("library_filter_source_all")}</option>`;
    for (const s of sources) {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s.split('/').pop();
      this.sourceFilter.appendChild(opt);
    }
    // 恢复选中的来源
    if (this.filterSource && sources.includes(this.filterSource)) {
      this.sourceFilter.value = this.filterSource;
    } else {
      this.sourceFilter.value = "all";
      this.filterSource = "all";
    }
    this.filterData();
  }

  async loadDataAndRender() {
    await this.loadData();
    this.render();
  }

  // ---------- 筛选与排序 ----------
  filterData() {
    let filtered = this.allCards;
    // 搜索
    if (this.searchQuery) {
      const q = this.searchQuery;
      filtered = filtered.filter(c =>
        c.word.toLowerCase().includes(q) ||
        (c.aliases && c.aliases.some(a => a.toLowerCase().includes(q)))
      );
    }
    // 颜色
    if (this.filterColor !== "all") {
      const col = this.filterColor === "default" ? "" : this.filterColor;
      filtered = filtered.filter(c => (c.color || "") === col);
    }
    // 状态
    if (this.filterStatus !== "all") {
      if (this.filterStatus === "learning") {
        filtered = filtered.filter(c => !c._mastered && !c._ignored);
      } else if (this.filterStatus === "mastered") {
        filtered = filtered.filter(c => c._mastered);
      } else if (this.filterStatus === "ignored") {
        filtered = filtered.filter(c => c._ignored);
      }
    }
    // 来源
    if (this.filterSource !== "all") {
      filtered = filtered.filter(c => c.sourceFile === this.filterSource);
    }
    // 排序
    const field = this.sortField;
    const asc = this.sortAsc;
    filtered.sort((a, b) => {
      let va, vb;
      if (field === "word") { va = a.word.toLowerCase(); vb = b.word.toLowerCase(); }
      else if (field === "status") {
        const getStatus = (c) => c._mastered ? 2 : (c._ignored ? 1 : 0);
        va = getStatus(a); vb = getStatus(b);
      }
      else if (field === "color") { va = a.color || ""; vb = b.color || ""; }
      else if (field === "source") { va = a.sourceFile; vb = b.sourceFile; }
      else { va = a.word; vb = b.word; }
      if (va < vb) return asc ? -1 : 1;
      if (va > vb) return asc ? 1 : -1;
      return 0;
    });
    this.filteredCards = filtered;
    this.totalRows = filtered.length;
    const validUids = new Set(filtered.map(c => c._uid));
    for (const uid of this.selectedRows) {
      if (!validUids.has(uid)) this.selectedRows.delete(uid);
    }
    this.updateBatchBar();
    this.updateStats();
  }

  // ---------- 统计 ----------
  updateStats() {
    const total = this.allCards.length;
    const mastered = this.allCards.filter(c => c._mastered).length;
    const ignored = this.allCards.filter(c => c._ignored).length;
    const learning = total - mastered - ignored;

    const masteredPct = total ? (mastered / total * 100).toFixed(1) : "0.0";
    const learningPct = total ? (learning / total * 100).toFixed(1) : "0.0";
    const ignoredPct = total ? (ignored / total * 100).toFixed(1) : "0.0";

    const masteredBar = total ? Math.round(mastered / total * 100) : 0;
    const ignoredBar = total ? Math.round(ignored / total * 100) : 0;

    this.statsBar.innerHTML = `
    <span>${t("library_stats_total", total)}</span>
    <span>${t("library_stats_learning", learning, learningPct)}</span>
    <span>${t("library_stats_mastered", mastered, masteredPct)}</span>
    <span>${t("library_stats_ignored", ignored, ignoredPct)}</span>
    <div style="flex:1; height:6px; background:var(--background-modifier-border); border-radius:3px; margin:0 10px; overflow:hidden; display:flex;">
        <div style="width:${masteredBar}%; height:100%; background:var(--color-green); border-radius:3px 0 0 3px; flex-shrink:0;"></div>
        <div style="width:${ignoredBar}%; height:100%; background:var(--text-muted); border-radius:0 3px 3px 0; flex-shrink:0;"></div>
        <div style="flex:1; height:100%; background:transparent;"></div>
    </div>
    `;
  }

  // ---------- 渲染（虚拟滚动） ----------
  render() {
    if (!this.tableBody) return;
    const total = this.totalRows;
    const containerHeight = this.scrollContainer.clientHeight || 400;
    const visibleRows = Math.ceil(containerHeight / this.rowHeight) + 5;
    const start = Math.floor(this.scrollContainer.scrollTop / this.rowHeight);
    const end = Math.min(start + visibleRows, total);
    this.tableBody.innerHTML = '';
    if (start > 0) {
      const spacer = document.createElement('tr');
      spacer.style.height = (start * this.rowHeight) + 'px';
      spacer.style.display = 'table-row';
      this.tableBody.appendChild(spacer);
    }
    for (let i = start; i < end; i++) {
      const card = this.filteredCards[i];
      if (!card) continue;
      const tr = this.createRow(card);
      this.tableBody.appendChild(tr);
    }
    if (end < total) {
      const spacer = document.createElement('tr');
      spacer.style.height = ((total - end) * this.rowHeight) + 'px';
      spacer.style.display = 'table-row';
      this.tableBody.appendChild(spacer);
    }
    if (total === 0) {
      const tr = document.createElement('tr');
      const td = tr.createEl('td', { colspan: 7, text: t("library_empty") });
      td.style.textAlign = 'center';
      td.style.padding = '20px';
      td.style.color = 'var(--text-muted)';
      this.tableBody.appendChild(tr);
    }
    this.tableBody.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      const uid = cb.dataset.uid;
      if (uid && this.selectedRows.has(uid)) cb.checked = true;
    });
  }

  onScroll() { this.render(); }

  // ---------- 创建行 ----------
  createRow(card) {
    const tr = document.createElement('tr');
    tr.dataset.uid = card._uid;
    // 复选框
    const tdCheck = tr.createEl('td');
    const cb = tdCheck.createEl('input', { type: 'checkbox' });
    cb.dataset.uid = card._uid;
    cb.addEventListener('change', (e) => {
      if (e.target.checked) this.selectedRows.add(card._uid);
      else this.selectedRows.delete(card._uid);
      this.updateBatchBar();
    });

    // 单词
    const tdWord = tr.createEl('td');
    tdWord.title = card.word;
    const wordSpan = tdWord.createSpan({ text: card.word });
    wordSpan.className = "library-word";
    wordSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      playPronunciation(
        card.word,
        this.plugin.settings.ttsUrlTemplate,
        this.plugin.settings.pronunciationVariant,
        card.lang
      );
    });
    // 单词列右键菜单
    tdWord.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      new WordCopyMenu(this.plugin, card).showAtMouseEvent(e);
    });

    // 音标
    const tdPhon = tr.createEl('td', { text: card.phonetic || '' });
    tdPhon.title = card.phonetic || '';
    // 释义
    const def = card.definition || '';
    const shortDef = def.length > 50 ? def.slice(0, 50) + '…' : def;
    const tdDef = tr.createEl('td', { text: shortDef });
    tdDef.title = def; // 悬停显示完整
    // 来源
    const tdSource = tr.createEl('td', { text: card.sourceFile.split('/').pop() });
    tdSource.title = card.sourceFile;
    // 颜色（色块）
    const tdColor = tr.createEl('td');
    const colorMap = {
      red: 'var(--color-red)',
      orange: 'var(--color-orange)',
      yellow: 'var(--color-yellow)',
      green: 'var(--color-green)',
      blue: 'var(--color-blue)',
      purple: 'var(--color-purple)',
      pink: 'var(--color-pink)',
      cyan: 'var(--color-cyan)'
    };
    const colorVal = colorMap[card.color] || 'var(--interactive-accent)';
    const dot = tdColor.createSpan({ cls: 'color-dot' });
    dot.style.backgroundColor = colorVal;
    // 状态
    const tdStatus = tr.createEl('td');
    let statusText, statusColor;
    if (card._mastered) {
      statusText = t("library_status_mastered");
      statusColor = 'var(--color-green)';
    } else if (card._ignored) {
      statusText = t("library_status_ignored");
      statusColor = 'var(--text-muted)';
    } else {
      statusText = t("library_status_learning");
      statusColor = 'var(--color-blue)';
    }
    tdStatus.textContent = statusText;
    tdStatus.style.color = statusColor;

    // 双击编辑
    tr.addEventListener('dblclick', () => {
      const fileSetting = this.plugin.settings.wordbookFiles.find(f => f.path === card.sourceFile);
      if (fileSetting && fileSetting.readonly) {
        new Notice(t("notice_readonly_cannot_edit"));
        return;
      }
      new WordModal(this.plugin.app, this.plugin, card).open();
    });
    // 右键菜单
    tr.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      new WordContextMenu(this.plugin, card).showAtMouseEvent(e);
    });

    return tr;
  }

  // ---------- 批量操作 ----------
  getSelectedCards() {
    const uidSet = this.selectedRows;
    return this.filteredCards.filter(c => uidSet.has(c._uid));
  }

  updateBatchBar() {
    const count = this.selectedRows.size;
    if (count > 0) {
      this.batchBar.style.display = 'flex';
      this.batchInfo.textContent = t("library_batch_selected", count);
    } else {
      this.batchBar.style.display = 'none';
    }
  }

  // 批量修改颜色
  async batchSetColor(colorVal) {
    const cards = this.getSelectedCards();
    if (!cards.length) return;
    for (const card of cards) {
      card.color = colorVal === 'default' ? '' : colorVal;
      await WordbookParser.saveCard(this.plugin.app, card.sourceFile, card, false);
    }
    await this.plugin.reloadAllCards();
    await this.plugin.highlighter.refresh();
    this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
    new Notice(t("library_batch_color_success", cards.length));
    //this.selectedRows.clear();
    this.loadDataAndRender();
  }

  // 批量标记/取消掌握
  async batchSetMastered(mastered) {
    const cards = this.getSelectedCards();
    if (!cards.length) return;
    const store = this.plugin.masteryStore;
    for (const card of cards) {
      await store.setMastered(card._stateKey, mastered);
    }
    //this.selectedRows.clear();
    this.loadDataAndRender();
    this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
    new Notice(t(mastered ? "library_batch_mastered_success" : "library_batch_unmaster_success", cards.length));
  }

  // 批量标记/取消忽略
  async batchSetIgnored(ignored) {
    const cards = this.getSelectedCards();
    if (!cards.length) return;
    const store = this.plugin.masteryStore;
    for (const card of cards) {
      await store.setIgnored(card._stateKey, ignored);
    }
    //this.selectedRows.clear();
    this.loadDataAndRender();
    this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
    new Notice(t(ignored ? "library_batch_ignored_success" : "library_batch_unignored_success", cards.length));
  }

  // 批量删除
  async batchDelete() {
    const cards = this.getSelectedCards();
    if (!cards.length) return;

    // 弹出确认对话框
    const confirmed = await new Promise((resolve) => {
      const modal = new ConfirmModal(
        this.plugin.app,
        () => resolve(true),
        () => resolve(false),
        t("library_confirm_delete_batch", cards.length)
      );
      modal.open();
    });
    if (!confirmed) return;

    let failed = 0;
    let success = 0;
    const failedWords = [];

    // 按错误类型分类存储（用于控制台详细输出）
    const errors = {
      readonly: [],      // 文件只读
      notFound: [],      // 卡片不存在
      other: []          // 其他异常
    };

    // 逐个删除
    for (const card of cards) {
      // 检查词库是否只读
      const fileSetting = this.plugin.settings.wordbookFiles.find(f => f.path === card.sourceFile);
      if (fileSetting?.readonly) {
        failed++;
        failedWords.push(card.word);
        errors.readonly.push({ word: card.word, file: card.sourceFile });
        continue;
      }

      try {
        const result = await WordbookParser.deleteCard(
          this.plugin.app,
          card.sourceFile,
          card.word
        );
        if (result) {
          success++;
        } else {
          // 卡片不存在（可能已被手动删除）
          failed++;
          failedWords.push(card.word);
          errors.notFound.push({ word: card.word, file: card.sourceFile });
        }
      } catch (e) {
        failed++;
        failedWords.push(card.word);

        // 按错误类型分类
        const errorInfo = { word: card.word, file: card.sourceFile, error: e };

        if (e.code === 'EPERM' || e.code === 'EACCES') {
          // 文件只读 / 权限不足
          errors.readonly.push(errorInfo);
        } else {
          // 其他异常
          errors.other.push(errorInfo);
        }

        // 始终输出单条错误日志到控制台（便于实时调试）
        console.error(`Failed to delete "${card.word}" from "${card.sourceFile}":`, e);
      }
    }

    // 控制台批量输出分类汇总
    if (failed > 0) {
      console.group(`📋 Batch Delete Summary: ${success} succeeded, ${failed} failed`);

      if (errors.readonly.length > 0) {
        console.group(`🔒 Read-only / Permission (${errors.readonly.length} words):`);
        errors.readonly.forEach(({ word, file }) => {
          console.log(`  • ${word} (${file})`);
        });
        console.groupEnd();
      }

      if (errors.notFound.length > 0) {
        console.group(`❓ Not Found (${errors.notFound.length} words):`);
        errors.notFound.forEach(({ word, file }) => {
          console.log(`  • ${word} (${file})`);
        });
        console.groupEnd();
      }

      if (errors.other.length > 0) {
        console.group(`⚠️ Other Errors (${errors.other.length} words):`);
        errors.other.forEach(({ word, file, error }) => {
          console.log(`  • ${word} (${file})`);
          console.log(`    → ${error.message || error}`);
        });
        console.groupEnd();
      }

      console.groupEnd();
    }

    // 刷新数据
    await this.plugin.reloadAllCards();
    await this.plugin.highlighter.refresh();
    this.plugin.app.workspace.trigger("simple-wordbook:data-updated");

    //显示结果通知
    if (failed === 0) {
      // 全部成功
      new Notice(t("library_batch_delete_success", success));
    } else {
      // 构建失败列表字符串（截断过长列表）
      let wordList;
      if (failedWords.length <= 5) {
        wordList = failedWords.join(', ');
      } else {
        const firstFive = failedWords.slice(0, 5).join(', ');
        const remaining = failedWords.length - 5;
        wordList = firstFive + t("library_batch_delete_and_more", remaining);
      }

      // 构建通知消息 + 控制台提示
      let message = t("library_batch_delete_failed", success, failed, wordList);
      message += " " + t("library_batch_delete_see_console");

      new Notice(message);
      // 完整分类错误信息已输出到控制台
    }

    // 重新渲染表格
    this.loadDataAndRender();
  }
}

// ========== 学习中心视图（StudyView） ==========
class StudyView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.studyStore = plugin.studyStore;
    this.currentTab = "review"; // "review", "mastered", "levels", "stats", "settings"
    this.reviewQueue = [];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.reviewing = false;
    this.totalReviewed = 0;
    this.totalMastered = 0;
    this.cardContainer = null;
    this.progressEl = null;
    this.btnForget = null;
    this.btnRemember = null;
    this.tabBar = null;
    this.contentEl = null;
    this._autoFlipTimer = null;
    this._statsCache = null;
    this._statsCacheTime = 0;
    this._rendering = false;
  }

  getViewType() { return VIEW_TYPE_STUDY; }
  getDisplayText() { return t("study_view_title"); }
  getIcon() { return "target"; }

  _keyHandler = null;

  // 键盘事件
  handleKeydown(e) {
    // 确保当前视图是激活状态
    if (this.app.workspace.activeLeaf !== this.leaf) {
      return;
    }

    // 不在复习中直接忽略
    if (!this.reviewing || this.reviewQueue.length === 0) return;

    // 排除所有输入/文本区域
    if (e.target.closest('input, textarea, select')) return;

    // 排除 Obsidian 编辑器（编辑模式 & 阅读模式）
    if (e.target.closest('.cm-editor, .markdown-source-view, .markdown-preview-view')) {
      return;
    }

    // 数字键 1-9 切换标签（仅背面）
    if (e.key >= '1' && e.key <= '9') {
      if (!this.isFlipped) return;
      const cardEl = this.cardContainer;
      if (!cardEl) return;
      const tabBar = cardEl.querySelector('.study-card-tab-bar');
      if (!tabBar) return;
      const tabs = tabBar.querySelectorAll('.study-card-tab');
      const idx = parseInt(e.key) - 1;
      if (idx < tabs.length) {
        e.preventDefault();
        e.stopPropagation();
        tabs[idx].click();
        tabs[idx].focus();
      }
      return;
    }
    // 空格翻转
    if (e.key === " " || e.key === "Space") {
      e.preventDefault();
      this.toggleCardFlip();
      // Ctrl + ←/→ 上一个/下一个
    } else if (e.key === "ArrowLeft" && e.ctrlKey) {
      e.preventDefault();
      this.goToPrevCard();
    } else if (e.key === "ArrowRight" && e.ctrlKey) {
      e.preventDefault();
      this.goToNextCard();
      // 左右箭头
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      this.handleRemember('good');
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      this.handleForget();
      // 上下箭头（精细反馈模式）
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const enableFineFeedback = this.plugin.settings.study.enableFineFeedback || false;
      if (enableFineFeedback) {
        this.handleHard();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const enableFineFeedback = this.plugin.settings.study.enableFineFeedback || false;
      if (enableFineFeedback) {
        this.handleEasy();
      }
    }
  }

  // 卡片翻转方法
  toggleCardFlip() {
    if (!this.cardContainer) return;
    this.isFlipped = !this.isFlipped;
    const front = this.cardContainer.querySelector('.study-card-front');
    const back = this.cardContainer.querySelector('.study-card-back');
    if (front) front.style.display = this.isFlipped ? "none" : "flex";
    if (back) back.style.display = this.isFlipped ? "block" : "none";
    if (this._autoFlipTimer) {
      clearTimeout(this._autoFlipTimer);
      this._autoFlipTimer = null;
    }
  }

  async onOpen() {
    this.containerEl.empty();
    this.containerEl.addClass("simple-wordbook-study");
    this.buildUI();
    await this.switchTab(this.currentTab);

    // 注册键盘事件
    this._keyHandler = this.handleKeydown.bind(this);
    this.registerDomEvent(document, "keydown", this._keyHandler);

    // 监听数据更新事件，刷新视图
    this.registerEvent(this.plugin.app.workspace.on("simple-wordbook:data-updated", () => {
      // 清除统计缓存，确保下次渲染时重新计算
      this._statsCacheTime = 0;
      this.refresh();
    }));
    this.registerEvent(this.plugin.app.vault.on("modify", (file) => {
      if (file instanceof TFile && file.extension === "json") {
        const isWordbook = this.plugin.settings.wordbookFiles.some(wb => wb.path === file.path);
        if (isWordbook) {
          this._statsCacheTime = 0;
          this.refresh();
        }
      }
    }));
    this.registerEvent(this.plugin.app.workspace.on("simple-wordbook:settings-updated", () => {
      this.studyStore.data.dailyGoal = this.plugin.settings.study.dailyGoal || 10;
      this.studyStore.save();
      this.updateTopBar();
    }));
  }

  onClose() {
    if (this._autoFlipTimer) {
      clearTimeout(this._autoFlipTimer);
      this._autoFlipTimer = null;
    }
    // 清除键盘事件引用
    this._keyHandler = null;
  }

  // ----- 刷新视图 -----
  async refresh() {
    // 刷新顶部标题栏
    const titleEl = this.containerEl?.querySelector('.study-title');
    if (titleEl) {
      titleEl.textContent = t("study_view_title");
    }

    // 刷新标签栏文字
    const tabMap = [
      { id: "review", key: "study_tab_review" },
      { id: "mastered", key: "study_tab_mastered" },
      { id: "levels", key: "study_tab_levels" },
      { id: "stats", key: "study_tab_stats" },
      { id: "settings", key: "study_tab_settings" }
    ];
    for (const tab of tabMap) {
      const tabEl = this.containerEl?.querySelector(`.study-tab[data-tab="${tab.id}"]`);
      if (tabEl) {
        tabEl.textContent = t(tab.key);
      }
    }
    this.updateTopBar();

    // 刷新当前标签
    if (this.currentTab === "review") this.renderReviewTab();
    else if (this.currentTab === "mastered") this.renderMasteredTab();
    else if (this.currentTab === "levels") this.renderLevelsTab();
    else if (this.currentTab === "stats") this.renderStatsTab();
    else if (this.currentTab === "settings") this.renderSettingsTab();
    this.updateTopBar();
  }

  // ----- 构建 UI（顶部栏 + 标签栏 + 内容区） -----
  buildUI() {
    const container = this.containerEl;

    // 顶部栏
    const topBar = container.createDiv({ cls: "study-top-bar" });
    topBar.createSpan({ text: t("study_view_title"), cls: "study-title" });
    this.goalDisplay = topBar.createSpan({ cls: "study-goal" });
    this.updateTopBar();

    // 标签栏
    const tabBar = container.createDiv({ cls: "study-tab-bar" });
    const tabs = [
      { id: "review", label: t("study_tab_review") },
      { id: "mastered", label: t("study_tab_mastered") },
      { id: "levels", label: t("study_tab_levels") },
      { id: "stats", label: t("study_tab_stats") },
      { id: "settings", label: t("study_tab_settings") }
    ];
    for (const tab of tabs) {
      const tabEl = tabBar.createDiv({ cls: "study-tab", text: tab.label });
      tabEl.dataset.tab = tab.id;
      if (this.currentTab === tab.id) tabEl.addClass("active");
      tabEl.addEventListener("click", () => this.switchTab(tab.id));
    }
    this.tabBar = tabBar;

    // 内容容器
    const contentContainer = container.createDiv({ cls: "study-content" });
    this.contentEl = contentContainer;
    this.switchTab(this.currentTab);
  }

  // ----- 更新顶部目标显示 -----
  updateTopBar() {
    const stats = this.studyStore.getTodayStats();
    const reviewed = stats ? stats.reviewed : 0;
    const goal = this.studyStore.data.dailyGoal || 10;

    if (this.goalDisplay) {
      // 显示 "今日：X/Y"
      let text = t("study_today_goal", reviewed, goal);
      // 如果达成目标，追加对勾
      if (goal > 0 && reviewed >= goal) {
        text += " ✅";
      }
      this.goalDisplay.textContent = text;
    }
  }

  // ----- 切换标签 -----
  async switchTab(tabId) {
    // 如果离开 review 标签，清理自动翻转定时器
    if (this.currentTab === "review" && tabId !== "review") {
      if (this._autoFlipTimer) {
        clearTimeout(this._autoFlipTimer);
        this._autoFlipTimer = null;
      }
    }

    this.currentTab = tabId;
    if (this.tabBar) {
      this.tabBar.querySelectorAll('.study-tab').forEach(el => {
        el.toggleClass('active', el.dataset.tab === tabId);
      });
    }
    await this.refresh();
  }

  // ---------- 复习标签 ----------
  async renderReviewTab() {
    // 清理旧定时器（当用户回到准备界面时，停止任何正在运行的自动翻转）
    if (this._autoFlipTimer) {
      clearTimeout(this._autoFlipTimer);
      this._autoFlipTimer = null;
    }

    if (this._rendering) return;
    this.updateTopBar();
    this._rendering = true;
    try {
      const container = this.contentEl;
      container.empty();
      if (this.reviewing) {
        this.renderReviewSession(container);
      } else {
        this.renderPreparation(container);
      }
    } finally {
      this._rendering = false;
    }
  }
  // ----- 复习标签界面 -----
  renderPreparation(container) {
    container.empty();

    // 获取词库列表
    const wordbooks = this.plugin.settings.wordbookFiles.filter(f => f.enabled);
    if (wordbooks.length === 0) {
      container.createDiv({ cls: "study-empty", text: t("study_prep_no_wordbooks") });
      return;
    }

    // 下拉选择器
    const selectRow = container.createDiv({ cls: "study-prep-select-row" });
    const label = selectRow.createSpan({ cls: "study-prep-label", text: t("study_prep_wordbook") + "：" });
    const select = selectRow.createEl("select");
    const currentSelected = this.plugin.settings.study.selectedWordbook || "all";
    const allOpt = select.createEl("option", { value: "all", text: t("study_prep_all") });
    if (currentSelected === "all") allOpt.selected = true;
    for (const wb of wordbooks) {
      const opt = select.createEl("option", { value: wb.path, text: wb.name });
      if (currentSelected === wb.path) opt.selected = true;
    }
    select.addEventListener("change", (e) => {
      this.plugin.settings.study.selectedWordbook = e.target.value;
      this.plugin.saveSettings();
      this.renderPreparation(this.contentEl);
    });

    // 获取卡片数据并统计
    const filteredCards = this.getFilteredCards();
    const total = filteredCards.length;
    let masteredCount = 0, ignoredCount = 0;
    for (const card of filteredCards) {
      const key = getStudyKey(card.word, card.sourceFile);
      if (this.plugin.masteryStore.isMastered(key)) masteredCount++;
      else if (this.plugin.masteryStore.isIgnored(key)) ignoredCount++;
    }
    const learningCount = total - masteredCount - ignoredCount;
    const dueCount = this.studyStore.countDueWords(filteredCards);

    // 统计行
    const statsRow = container.createDiv({ cls: "study-prep-stats" });
    statsRow.createSpan({ cls: "stat-item", text: `${t("study_prep_total")}：${total}` });
    statsRow.createSpan({ cls: "stat-item", text: `${t("study_prep_mastered")}：${masteredCount}` });
    statsRow.createSpan({ cls: "stat-item", text: `${t("study_prep_ignored")}：${ignoredCount}` });
    statsRow.createSpan({ cls: "stat-item", text: `${t("study_prep_learning")}：${learningCount}` });

    // 空状态
    if (total === 0) {
      container.createDiv({ cls: "study-empty", text: t("study_prep_empty_book") });
      return;
    }

    // 全部掌握
    if (learningCount === 0) {
      container.createDiv({ cls: "study-empty", text: t("study_prep_all_mastered") });
      return;
    }

    // 复习信息和复习按钮
    const infoContainer = container.createDiv({ cls: "study-review-info" });
    const limit = this.plugin.settings.study.dailyReviewLimit || 20;
    const actualCount = Math.min(learningCount, limit);
    infoContainer.createSpan({
      text: t("study_review_motivation", dueCount, actualCount)
    });

    const btn = container.createEl("button", { text: t("study_btn_start"), cls: "mod-cta" });
    btn.addEventListener("click", () => {
      this.startReviewWithFilter(filteredCards);
    });
  }
  // ----- 复习标签界面过滤词库 -----
  getFilteredCards() {
    const allCards = this.plugin.getAllCards();
    const selected = this.plugin.settings.study.selectedWordbook || "all";
    if (selected === "all") {
      return allCards;
    } else {
      return allCards.filter(c => c.sourceFile === selected);
    }
  }
  // ----- 复习标签界面获取词库统计信息 -----
  async startReviewWithFilter(cards) {
    const limit = this.plugin.settings.study.dailyReviewLimit || 20;
    const due = await this.studyStore.getDueWords(cards, limit);
    if (due.length === 0) {
      new Notice(t("study_review_empty"));
      return;
    }
    this.reviewQueue = due;
    this.currentIndex = 0;
    this.totalReviewed = 0;
    this.totalMastered = 0;
    this.reviewing = true;
    this.renderReviewTab();
  }

  async renderReviewSession(container) {
    // 清理旧定时器（每次重新渲染卡片时，取消之前设置的自动翻转）
    if (this._autoFlipTimer) {
      clearTimeout(this._autoFlipTimer);
      this._autoFlipTimer = null;
    }

    container.empty();
    if (this.currentIndex >= this.reviewQueue.length) {
      // 复习完成
      const done = container.createDiv({ cls: "study-done" });
      const todayTotal = this.studyStore.getTodayStats().reviewed || 0; // 获取今日累计数
      done.createEl("p", { text: t("study_review_done", this.totalReviewed, todayTotal) });

      // 按钮容器
      const buttonGroup = done.createDiv({ cls: "study-done-buttons" });

      // 再来一轮按钮
      const againBtn = buttonGroup.createEl("button", { text: t("study_btn_again"), cls: "mod-cta" });
      againBtn.addEventListener("click", async () => {
        const filteredCards = this.getFilteredCards();   // 按当前词库过滤
        const due = await this.studyStore.getDueWords(filteredCards, this.plugin.settings.study.dailyReviewLimit || 20);
        if (due.length === 0) {
          this.reviewing = false;
          this.renderReviewTab();
          return;
        }
        this.startReviewWithWords(due);
      });

      // 返回准备界面按钮
      const backBtn = buttonGroup.createEl("button", { text: t("study_btn_back") });
      backBtn.addEventListener("click", () => {
        this.reviewing = false;
        this.renderReviewTab();
      });

      return;
    }

    const item = this.reviewQueue[this.currentIndex];
    const card = item.card;
    const review = item.review;
    const level = review.level || 0;
    const interval = this.studyStore.getInterval(level);
    const nextDays = interval > 0 ? interval : (level >= 5 ? "∞" : "1");

    // 进度信息
    const progressRow = container.createDiv({ cls: "study-progress-row" });
    const progress = progressRow.createDiv({ cls: "study-progress" });
    progress.textContent = t("study_review_progress", this.currentIndex + 1, this.reviewQueue.length, level, nextDays);

    // 退出按钮
    const exitRow = container.createDiv({ cls: "study-exit-row" });
    const exitBtn = exitRow.createEl("button", { cls: "study-exit-btn" });
    exitBtn.style.display = "flex";
    exitBtn.style.alignItems = "center";
    exitBtn.style.gap = "4px";
    setIcon(exitBtn, "log-out");
    exitBtn.appendText(t("study_btn_exit"));
    exitBtn.addEventListener("click", () => {
      if (this._autoFlipTimer) {
        clearTimeout(this._autoFlipTimer);
        this._autoFlipTimer = null;
      }
      this.reviewing = false;
      this.reviewQueue = [];
      this.currentIndex = 0;
      this.renderReviewTab();
    });

    // 卡片
    const cardWrapper = container.createDiv({ cls: "study-card-wrapper" });
    const cardEl = cardWrapper.createDiv({ cls: "study-card" });
    // 卡片颜色
    const colorMap = {
      red: 'var(--color-red)',
      orange: 'var(--color-orange)',
      yellow: 'var(--color-yellow)',
      green: 'var(--color-green)',
      blue: 'var(--color-blue)',
      purple: 'var(--color-purple)',
      pink: 'var(--color-pink)',
      cyan: 'var(--color-cyan)'
    };
    cardEl.style.setProperty('--study-card-color', colorMap[card.color] || 'var(--interactive-accent)');

    // 词源名
    cardEl.style.position = 'relative';
    const sourceName = card.sourceFile.split('/').pop();
    const sourceEl = cardEl.createDiv({ cls: 'study-card-source', text: sourceName });

    // 正面（单词）
    const front = cardEl.createDiv({ cls: "study-card-front" });
    front.style.display = "flex";   // 明确显示

    const frontWord = front.createSpan({ cls: "study-card-word library-word", text: card.word });
    frontWord.addEventListener("click", (e) => {
      e.stopPropagation();
      playPronunciation(
        card.word,
        this.plugin.settings.ttsUrlTemplate,
        this.plugin.settings.pronunciationVariant,
        card.lang
      );
    });
    // 添加右键复制菜单
    frontWord.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      new WordCopyMenu(this.plugin, card).showAtMouseEvent(e);
    });

    if (this.plugin.settings.study.flashcardShowPhonetic && card.phonetic) {
      front.createSpan({ cls: "study-card-phonetic", text: card.phonetic });
    }
    front.createDiv({ cls: "study-card-hint", text: t("study_card_hint") });
    const shortcutHint = front.createDiv({ cls: "study-shortcut-hint" });
    const enableFineFeedback = this.plugin.settings.study.enableFineFeedback || false;
    if (enableFineFeedback) {
      shortcutHint.textContent = t("study_shortcut_hint_4btn");
    } else {
      shortcutHint.textContent = t("study_shortcut_hint");
    }

    // 背面（释义）
    const back = cardEl.createDiv({ cls: "study-card-back" });
    back.style.display = "none"; // 初始隐藏

    // ---- 背面顶部：单词 + 音标 ----
    const backTop = back.createDiv({ cls: "study-card-back-top" });

    const backWord = backTop.createSpan({ cls: "study-card-back-word library-word", text: card.word });
    backWord.addEventListener("click", (e) => {
      e.stopPropagation();
      playPronunciation(
        card.word,
        this.plugin.settings.ttsUrlTemplate,
        this.plugin.settings.pronunciationVariant,
        card.lang
      );
    });
    // 添加右键复制菜单
    backWord.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      new WordCopyMenu(this.plugin, card).showAtMouseEvent(e);
    });

    if (this.plugin.settings.study.flashcardShowPhonetic && card.phonetic) {
      const backPhonetic = backTop.createSpan({ cls: "study-card-back-phonetic", text: card.phonetic });
    }

    // ---- 分隔线 ----
    const backDivider = back.createDiv({ cls: "study-card-divider" });

    // ---- 背面内容区域：章节标签 + 释义 ----
    // 解析定义中的章节
    const sections = parseSections(card.definition || t("no_definition"));
    const hasMultipleSections = sections.length > 1;
    const showTabs = this.plugin.settings.study.flashcardShowTabs !== false;

    // 根据设置决定显示方式
    if (hasMultipleSections && showTabs) {
      // 标签模式
      const tabBar = back.createDiv({ cls: "study-card-tab-bar" });

      // 内容容器
      const contentDiv = back.createDiv({ cls: "study-card-content" });

      // 渲染指定章节
      const renderSection = async (index) => {
        contentDiv.empty();
        const section = sections[index];
        if (section) {
          let content = section.content;
          const processed = processLineBreaks(content);
          await MarkdownRenderer.render(this.plugin.app, processed, contentDiv, card.sourceFile, this.plugin);
          fixInternalLinks(contentDiv, this.plugin.app, card.sourceFile);
        } else {
          contentDiv.setText(t("no_definition"));
        }
        contentDiv.scrollTop = 0;
      };

      // 创建标签
      sections.forEach((section, idx) => {
        const tab = tabBar.createDiv({ cls: "study-card-tab" });
        tab.textContent = section.title;
        tab.style.color = idx === 0 ? "var(--text-accent)" : "var(--text-muted)";
        tab.style.fontWeight = idx === 0 ? "bold" : "normal";
        tab.addEventListener("click", async (e) => {
          e.stopPropagation();
          tabBar.querySelectorAll(".study-card-tab").forEach(t => {
            t.style.color = "var(--text-muted)";
            t.style.fontWeight = "normal";
          });
          tab.style.color = "var(--text-accent)";
          tab.style.fontWeight = "bold";
          await renderSection(idx);
        });
      });

      // 默认渲染第一个章节
      await renderSection(0);

    } else {
      // 非标签模式
      const contentDiv = back.createDiv({ cls: "study-card-content" });

      if (sections.length === 0) {
        contentDiv.setText(t("no_definition"));
      } else {
        const combinedContent = sections.map(s => `**${s.title}**\n${s.content}`).join('\n\n---\n\n');
        const processed = processLineBreaks(combinedContent);
        await MarkdownRenderer.render(this.plugin.app, processed, contentDiv, card.sourceFile, this.plugin);
        fixInternalLinks(contentDiv, this.plugin.app, card.sourceFile);
      }
      contentDiv.scrollTop = 0;
    }

    // 翻转
    cardEl.addEventListener("dblclick", () => this.toggleCardFlip());

    // 卡片右键菜单（除单词区域外）
    cardEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (e.target.closest && e.target.closest('.library-word')) {
        return;
      }
      new WordContextMenu(this.plugin, card).showAtMouseEvent(e);
    });

    // 操作按钮行
    const btnWrapper = container.createDiv({ cls: "study-btn-wrapper" });
    // 精细反馈开关
    if (enableFineFeedback) {
      btnWrapper.addClass("fine-feedback");
    }

    // 上一个按钮
    const prevBtn = btnWrapper.createEl("button", { text: "◀ " + t("study_btn_prev"), cls: "study-nav-btn" });
    prevBtn.setAttribute("title", "Ctrl + ←");
    prevBtn.addEventListener("click", () => {
      this.goToPrevCard();
    });

    if (enableFineFeedback) {
      // 4 按钮模式
      const forgetBtn = btnWrapper.createEl("button", { text: t("study_btn_forget"), cls: "mod-forget" });
      forgetBtn.setAttribute("title", "←");
      forgetBtn.addEventListener("click", () => this.handleForget());

      const hardBtn = btnWrapper.createEl("button", { text: t("study_btn_hard"), cls: "mod-hard" });
      hardBtn.setAttribute("title", "↓");
      hardBtn.addEventListener("click", () => this.handleHard());

      const goodBtn = btnWrapper.createEl("button", { text: t("study_btn_good"), cls: "mod-good" });
      goodBtn.setAttribute("title", "→");
      goodBtn.addEventListener("click", () => this.handleRemember('good'));

      const easyBtn = btnWrapper.createEl("button", { text: t("study_btn_easy"), cls: "mod-easy" });
      easyBtn.setAttribute("title", "↑");
      easyBtn.addEventListener("click", () => this.handleEasy());

      // 禁用已掌握单词的所有按钮
      const key = getStudyKey(card.word, card.sourceFile);
      const isMastered = this.plugin.masteryStore.isMastered(key);
      if (isMastered) {
        forgetBtn.disabled = true;
        hardBtn.disabled = true;
        goodBtn.disabled = true;
        easyBtn.disabled = true;
        forgetBtn.style.opacity = '0.4';
        hardBtn.style.opacity = '0.4';
        goodBtn.style.opacity = '0.4';
        easyBtn.style.opacity = '0.4';
        forgetBtn.style.cursor = 'not-allowed';
        hardBtn.style.cursor = 'not-allowed';
        goodBtn.style.cursor = 'not-allowed';
        easyBtn.style.cursor = 'not-allowed';
      }

      // 保存引用（4按钮模式）
      this.btnForget = forgetBtn;
      this.btnRemember = goodBtn;
    } else {
      // 2 按钮模式（默认）
      const forgetBtn = btnWrapper.createEl("button", { text: t("study_btn_forget"), cls: "mod-forget" });
      forgetBtn.setAttribute("title", "←");
      forgetBtn.addEventListener("click", () => this.handleForget());

      const rememberBtn = btnWrapper.createEl("button", { text: t("study_btn_remember"), cls: "mod-good" });
      rememberBtn.setAttribute("title", "→");
      rememberBtn.addEventListener("click", () => this.handleRemember('good'));

      // 禁用已掌握单词的按钮
      const key = getStudyKey(card.word, card.sourceFile);
      const isMastered = this.plugin.masteryStore.isMastered(key);
      if (isMastered) {
        forgetBtn.disabled = true;
        rememberBtn.disabled = true;
        forgetBtn.style.opacity = '0.4';
        rememberBtn.style.opacity = '0.4';
        forgetBtn.style.cursor = 'not-allowed';
        rememberBtn.style.cursor = 'not-allowed';
      }

      // 保存引用（2按钮模式）
      this.btnForget = forgetBtn;
      this.btnRemember = rememberBtn;
    }

    // 下一个按钮
    const nextBtn = btnWrapper.createEl("button", { text: t("study_btn_next") + " ▶", cls: "study-nav-btn" });
    nextBtn.setAttribute("title", "Ctrl + →");
    nextBtn.addEventListener("click", () => {
      this.goToNextCard();
    });

    // 根据索引禁用导航按钮（视觉反馈）
    if (this.currentIndex === 0) prevBtn.disabled = true;
    if (this.currentIndex === this.reviewQueue.length - 1) nextBtn.disabled = true;

    // 保存引用
    this.cardContainer = cardEl;
    this.progressEl = progress;
    this.isFlipped = false;

    // 自动翻转
    const autoFlip = this.plugin.settings.study.flashcardAutoFlip || 0;
    if (autoFlip > 0) {
      this._autoFlipTimer = setTimeout(() => {
        if (!this.isFlipped) this.toggleCardFlip();
      }, autoFlip * 1000);
    }
  }

  // ----- 复习忘记按钮 -----
  handleForget() {
    if (this.currentIndex >= this.reviewQueue.length || this.reviewQueue.length === 0) {
      return;
    }
    const item = this.reviewQueue[this.currentIndex];
    const card = item.card;
    const review = item.review;

    // 如果单词已掌握，直接跳过
    const key = getStudyKey(card.word, card.sourceFile);
    if (this.plugin.masteryStore.isMastered(key)) {
      this.currentIndex++;
      this.renderReviewTab();
      return;
    }

    // 等级归零
    review.level = 0;

    // 调用 updateDifficulty，更新难易系数/搁置后时间
    const result = this.studyStore.updateDifficulty(review, 'again');

    // 设置下次复习日期
    if (result.suspendDays > 0) {
      review.nextReview = this.studyStore.getDateFromNow(result.suspendDays);
    } else {
      review.nextReview = this.studyStore.calculateNextReview(0, null, review.difficulty);
    }

    review.reviewCount += 1;
    review.lastReview = this.studyStore.getTodayISO();
    this.studyStore.setReview(card.word, card.sourceFile, review);
    this.studyStore.incrementReviewed();
    this.totalReviewed++;
    this.currentIndex++;
    this.renderReviewTab();
  }

  // ----- 复习记得/良好按钮 -----
  async handleRemember(rating = 'good') {
    if (this.currentIndex >= this.reviewQueue.length || this.reviewQueue.length === 0) {
      return;
    }
    const item = this.reviewQueue[this.currentIndex];
    const card = item.card;
    const review = item.review;

    // 如果单词已掌握，直接跳过
    const key = getStudyKey(card.word, card.sourceFile);
    if (this.plugin.masteryStore.isMastered(key)) {
      this.currentIndex++;
      this.renderReviewTab();
      return;
    }

    // 评级简单与良好/记得
    let newLevel;
    if (rating === 'good') {
      // 良好/记得：正常升 1 级
      newLevel = Math.min(5, review.level + 1);
    } else if (rating === 'easy') {
      // 等级 0-1 时跳级（0→2, 1→3）
      // 等级 >=2 时正常升 1 级（2→3, 3→4, 4→5）
      if (review.level <= 1) {
        newLevel = Math.min(5, review.level + 2);
      } else {
        newLevel = Math.min(5, review.level + 1);
      }
    }

    // 检查是否达到掌握
    if (newLevel >= 5) {
      // 达到等级5 → 自动标记为掌握
      const key = getStudyKey(card.word, card.sourceFile);
      // 保存到持久存储
      await this.plugin.masteryStore.setMastered(key, true);
      await this.studyStore.incrementMastered();
      await this.studyStore.incrementReviewed();
      this.totalReviewed++;
      this.totalMastered++;
      this.currentIndex++;
      // 触发全局数据更新
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
      return;
    }
    review.level = newLevel;

    // 调用 updateDifficulty，更新难易系数/搁置后时间
    this.studyStore.updateDifficulty(review, rating);

    // 计算下次复习日期
    review.nextReview = this.studyStore.calculateNextReview(newLevel, null, review.difficulty);

    review.reviewCount += 1;
    review.lastReview = this.studyStore.getTodayISO();
    await this.studyStore.setReview(card.word, card.sourceFile, review);
    await this.studyStore.incrementReviewed();  
    this.totalReviewed++;
    this.currentIndex++;
    this.renderReviewTab();
  }

  // ----- 复习困难按钮 -----
  handleHard() {
    if (this.currentIndex >= this.reviewQueue.length || this.reviewQueue.length === 0) {
      return;
    }
    const item = this.reviewQueue[this.currentIndex];
    const card = item.card;
    const review = item.review;

    // 如果单词已掌握，直接跳过
    const key = getStudyKey(card.word, card.sourceFile);
    if (this.plugin.masteryStore.isMastered(key)) {
      this.currentIndex++;
      this.renderReviewTab();
      return;
    }

    // 等级降级
    if (review.level >= 3) {
      review.level = 2;
    }

    // 调用 updateDifficulty，更新难易系数/搁置后时间
    const result = this.studyStore.updateDifficulty(review, 'hard');

    // 设置下次复习日期
    if (result.suspendDays > 0) {
      review.nextReview = this.studyStore.getDateFromNow(result.suspendDays);
    } else {
      review.nextReview = this.studyStore.calculateNextReview(review.level, null, review.difficulty);
    }

    review.reviewCount += 1;
    review.lastReview = this.studyStore.getTodayISO();
    this.studyStore.setReview(card.word, card.sourceFile, review);
    this.studyStore.incrementReviewed();
    this.totalReviewed++;
    this.currentIndex++;
    this.renderReviewTab();
  }

  // ----- 复习简单按钮 -----
  async handleEasy() {
    await this.handleRemember('easy');
  }

  // ----- 复习卡片导航（上一个/下一个） -----
  goToPrevCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderReviewTab();
    }
  }
  goToNextCard() {
    if (this.currentIndex < this.reviewQueue.length - 1) {
      this.currentIndex++;
      this.renderReviewTab();
    }
  }

  // ----- 开始复习 -----
  startReviewWithWords(dueWords) {
    this.reviewQueue = dueWords;
    this.currentIndex = 0;
    this.totalReviewed = 0;
    this.totalMastered = 0;
    this.reviewing = true;
    this.renderReviewTab();
  }

  // ---------- 已掌握标签（部分与等级列表共用 CSS 类） ----------
  renderMasteredTab() {
    const container = this.contentEl;
    container.empty();

    const allCards = this.plugin.getAllCards();
    const masteredCards = [];
    for (const card of allCards) {
      const key = getStudyKey(card.word, card.sourceFile);
      if (this.plugin.masteryStore.isMastered(key)) {
        masteredCards.push({
          card: card,
          reviewKey: key
        });
      }
    }

    if (masteredCards.length === 0) {
      container.createDiv({ cls: "study-empty", text: t("study_mastered_list_empty") });
      return;
    }

    // ---- 搜索行 ----
    const filterRow = container.createDiv({ cls: "study-level-filter-row" });
    const searchInput = filterRow.createEl("input", { type: "text" });
    searchInput.setAttribute("placeholder", t("study_level_search_placeholder"));

    const countLabel = filterRow.createSpan({ text: `${t("study_tab_mastered")} ${masteredCards.length}` });
    countLabel.addClass("study-mastered-count");

    // ---- 表格容器 ----
    const tableWrapper = container.createDiv({ cls: "study-level-table-wrapper" });
    const table = tableWrapper.createEl("table");
    table.addClass("study-level-table");

    // ---- 表头（5 列） ----
    const thead = table.createEl("thead");
    const headerRow = thead.createEl("tr");
    const headers = [
      t("library_table_header_word"),
      t("library_table_header_phonetic"),
      t("library_table_header_definition"),
      t("library_table_header_source"),
      t("study_table_header_actions")
    ];
    for (const h of headers) {
      headerRow.createEl("th", { text: h });
    }

    // ---- 表体 ----
    const tbody = table.createEl("tbody");

    // ---- 渲染函数 ----
    const renderTable = (query) => {
      tbody.empty();

      let filtered = masteredCards;
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(item => {
          const card = item.card;
          const word = card.word.toLowerCase();
          const phonetic = (card.phonetic || "").toLowerCase();
          const definition = (card.definition || "").toLowerCase();
          const source = card.sourceFile.split('/').pop().toLowerCase();
          const aliases = (card.aliases || []).join(' ').toLowerCase();
          return word.includes(q) ||
            phonetic.includes(q) ||
            definition.includes(q) ||
            source.includes(q) ||
            aliases.includes(q);
        });
      }

      // 空状态
      if (filtered.length === 0) {
        const tr = tbody.createEl("tr");
        const emptyText = query
          ? t("study_level_search_empty", query)
          : t("study_no_words_for_level");
        const td = tr.createEl("td", { colspan: 5, text: emptyText });
        td.style.cssText = "text-align: center; padding: 20px; color: var(--text-muted)";
        return;
      }

      filtered.sort((a, b) => a.card.word.localeCompare(b.card.word));

      for (const item of filtered) {
        const card = item.card;
        const key = item.reviewKey;
        const tr = tbody.createEl("tr");

        // ---- 单词列 ----
        const tdWord = tr.createEl("td");
        tdWord.title = card.word;
        const wordSpan = tdWord.createSpan({ text: card.word });
        wordSpan.addClass("library-word");
        wordSpan.addEventListener("click", () => {
          playPronunciation(
            card.word,
            this.plugin.settings.ttsUrlTemplate,
            this.plugin.settings.pronunciationVariant,
            card.lang
          );
        });
        // 单词列右键菜单（复制）
        tdWord.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          new WordCopyMenu(this.plugin, card).showAtMouseEvent(e);
        });

        // ---- 音标列 ----
        const tdPhon = tr.createEl("td", { text: card.phonetic || '' });
        tdPhon.title = card.phonetic || '';

        // ---- 释义列 ----
        const def = card.definition || '';
        const shortDef = def.length > 80 ? def.slice(0, 80) + '…' : def;
        const tdDef = tr.createEl("td", { text: shortDef });
        tdDef.title = def;

        // ---- 来源列 ----
        const tdSource = tr.createEl("td", { text: card.sourceFile.split('/').pop() });
        tdSource.title = card.sourceFile;

        // ---- 操作列（取消掌握按钮） ----
        const tdActions = tr.createEl("td");
        const actions = tdActions.createDiv({ cls: "study-level-actions" });

        const unmasterBtn = actions.createEl("button", { text: "↩️", cls: "clickable-icon" });
        unmasterBtn.setAttribute("aria-label", t("notice_mastery_label_on"));
        unmasterBtn.style.cssText = "padding: 0 4px; background: transparent; border: none; cursor: pointer; font-size: 1em; opacity: 0.6; transition: opacity 0.15s;";
        unmasterBtn.addEventListener("mouseenter", () => { unmasterBtn.style.opacity = "1"; });
        unmasterBtn.addEventListener("mouseleave", () => { unmasterBtn.style.opacity = "0.6"; });
        unmasterBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          await this.plugin.masteryStore.setMastered(key, false);
          const review = this.studyStore.getReview(card.word, card.sourceFile);
          if (review) {
            review.level = 0;
            review.nextReview = this.studyStore.calculateNextReview(0);
            this.studyStore.setReview(card.word, card.sourceFile, review);
          }
          this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
          this.renderMasteredTab();
        });

        // ---- 右键和双击事件 ----
        tr.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          new WordContextMenu(this.plugin, card).showAtMouseEvent(e);
        });
        tr.addEventListener("dblclick", () => {
          const fileSetting = this.plugin.settings.wordbookFiles.find(f => f.path === card.sourceFile);
          if (fileSetting && fileSetting.readonly) {
            new Notice(t("notice_readonly_cannot_edit"));
            return;
          }
          new WordModal(this.plugin.app, this.plugin, card).open();
        });
      }
    };

    renderTable("");

    // ---- 搜索监听 ----
    searchInput.addEventListener("input", (e) => {
      renderTable(e.target.value);
    });
  }

  // ---------- 等级列表标签 ----------
  renderLevelsTab() {
    const container = this.contentEl;
    container.empty();

    // 单词分类
    const getWordType = (reviewCount, level) => {
      // 顽固词
      if (reviewCount >= 8 && level <= 2) return 'stubborn';
      // 吃力词
      if (reviewCount >= 5 && level <= 2) return 'struggling';
      // 高效词
      if (reviewCount <= 5 && level >= 4) return 'efficient';
      // 新手词
      if (reviewCount <= 2) return 'newbie';
      // 稳步词
      return 'steady';
    };

    const allCards = this.plugin.getAllCards();
    // 获取所有有复习记录的单词及其等级
    const cardLevels = [];
    for (const card of allCards) {
      const key = getStudyKey(card.word, card.sourceFile);
      // 检查是否已忽略（忽略的词不显示）
      if (this.plugin.masteryStore.isIgnored(key)) continue;
      const review = this.studyStore.getReview(card.word, card.sourceFile);
      if (review) {
        let level = review.level || 0;
        // 如果已掌握但等级小于5，修正为5
        if (this.plugin.masteryStore.isMastered(key) && level < 5) {
          level = 5;
        }
        // 难度系数
        const difficulty = review.difficulty || 1.0;
        const reviewCount = review.reviewCount || 0;
        cardLevels.push({ card, level, reviewKey: key, difficulty, reviewCount });
      }
    }

    if (cardLevels.length === 0) {
      container.createDiv({ cls: "study-empty", text: t("study_level_list_empty") });
      return;
    }

    // --- 搜索框 + 排序 + 筛选 ---
    const filterRow = container.createDiv({ cls: "study-level-filter-row" });

    // 搜索框
    const searchInput = filterRow.createEl("input", { type: "text" });
    searchInput.setAttribute("placeholder", t("study_level_search_placeholder"));

    // 等级筛选
    const filterSelect = filterRow.createEl("select");
    filterSelect.createEl("option", { value: "all", text: t("study_level_all") + ` (${cardLevels.length})` });
    for (let i = 5; i >= 0; i--) {
      const count = cardLevels.filter(item => item.level === i).length;
      filterSelect.createEl("option", { value: String(i), text: `${t("study_level_label", i)} (${count})` });
    }

    // 排序下拉
    const sortSelect = filterRow.createEl("select");
    sortSelect.createEl("option", { value: "level_desc", text: t("study_sort_level_desc") });
    sortSelect.createEl("option", { value: "level_asc", text: t("study_sort_level_asc") });
    sortSelect.createEl("option", { value: "difficulty_desc", text: t("study_sort_diff_desc") });
    sortSelect.createEl("option", { value: "difficulty_asc", text: t("study_sort_diff_asc") });
    sortSelect.createEl("option", { value: "review_count_desc", text: t("study_sort_review_desc") });
    sortSelect.createEl("option", { value: "review_count_asc", text: t("study_sort_review_asc") });
    if (!this._levelSortMode) this._levelSortMode = "level_desc";
    sortSelect.value = this._levelSortMode;

    // 单词类型筛选
    const typeFilterSelect = filterRow.createEl("select");
    // 统计各类型数量
    const typeCounts = {
      all: cardLevels.length,
      newbie: 0,
      steady: 0,
      efficient: 0,
      struggling: 0,
      stubborn: 0
    };

    for (const item of cardLevels) {
      const type = getWordType(item.reviewCount || 0, item.level);
      if (typeCounts[type] !== undefined) typeCounts[type]++;
    }
    // 类型下拉
    typeFilterSelect.createEl("option", { value: "all", text: `${t("study_type_filter_all")} (${typeCounts.all})` });
    typeFilterSelect.createEl("option", { value: "newbie", text: `${t("study_type_newbie")} (${typeCounts.newbie})` });
    typeFilterSelect.createEl("option", { value: "steady", text: `${t("study_type_steady")} (${typeCounts.steady})` });
    typeFilterSelect.createEl("option", { value: "efficient", text: `${t("study_type_efficient")} (${typeCounts.efficient})` });
    typeFilterSelect.createEl("option", { value: "struggling", text: `${t("study_type_struggling")} (${typeCounts.struggling})` });
    typeFilterSelect.createEl("option", { value: "stubborn", text: `${t("study_type_stubborn")} (${typeCounts.stubborn})` });

    if (!this._selectedType) this._selectedType = "all";
    typeFilterSelect.value = this._selectedType;

    // 当前选中的等级
    let selectedLevel = "all";

    // --- 表格容器 ---
    const tableWrapper = container.createDiv({ cls: "study-level-table-wrapper" });
    const table = tableWrapper.createEl("table");
    table.className = "study-level-table";

    // 表头
    const thead = table.createEl("thead");
    const headerRow = thead.createEl("tr");
    const headers = [
      t("library_table_header_word"),
      t("library_table_header_phonetic"),
      t("library_table_header_definition"),
      t("library_table_header_source"),
      t("study_table_header_review_count"),
      t("library_table_header_difficulty"),
      t("study_table_header_level"),
      t("study_table_header_actions")
    ];
    for (const h of headers) {
      headerRow.createEl("th", { text: h });
    }

    // 表体
    const tbody = table.createEl("tbody");

    // 等级颜色
    const levelColors = [
      "var(--color-blue)",                                                        // 等级0: 纯蓝色
      "color-mix(in srgb, var(--color-blue) 80%, var(--color-green) 20%)",        // 等级1: 蓝80%+绿20%
      "color-mix(in srgb, var(--color-blue) 60%, var(--color-green) 40%)",        // 等级2: 蓝60%+绿40%
      "color-mix(in srgb, var(--color-blue) 40%, var(--color-green) 60%)",        // 等级3: 蓝40%+绿60%
      "color-mix(in srgb, var(--color-blue) 20%, var(--color-green) 80%)",        // 等级4: 蓝20%+绿80%
      "var(--color-green)"                                                        // 等级5: 纯绿色
    ];

    // 渲染表格函数
    const renderTable = (level, searchQuery, sortMode, typeFilter) => {
      tbody.empty();

      let filtered = cardLevels;

      // 1. 按等级过滤
      if (level !== "all") {
        const lvl = parseInt(level);
        filtered = filtered.filter(item => item.level === lvl);
      }

      // 2. 按单词类型过滤
      if (typeFilter !== "all") {
        filtered = filtered.filter(item => {
          const itemType = getWordType(item.reviewCount || 0, item.level);
          return itemType === typeFilter;
        });
      }

      // 3. 按搜索词过滤（搜索单词 + 音标 + 释义 + 来源文件名）
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(item => {
          const card = item.card;
          const word = card.word.toLowerCase();
          const phonetic = (card.phonetic || "").toLowerCase();
          const definition = (card.definition || "").toLowerCase();
          const source = card.sourceFile.split('/').pop().toLowerCase();
          const aliases = (card.aliases || []).join(' ').toLowerCase();
          return word.includes(q) ||
            phonetic.includes(q) ||
            definition.includes(q) ||
            source.includes(q) ||
            aliases.includes(q);
        });
      }

      // 4. 排序
      filtered.sort((a, b) => {
        if (sortMode === "level_asc") {
          return a.level - b.level;
        } else if (sortMode === "level_desc") {
          return b.level - a.level;
        } else if (sortMode === "difficulty_asc") {
          return (a.difficulty || 1.0) - (b.difficulty || 1.0);
        } else if (sortMode === "difficulty_desc") {
          return (b.difficulty || 1.0) - (a.difficulty || 1.0);
        } else if (sortMode === "review_count_asc") {
          return (a.reviewCount || 0) - (b.reviewCount || 0);
        } else if (sortMode === "review_count_desc") {
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        }
        return 0;
      });

      // 空状态
      if (filtered.length === 0) {
        const tr = tbody.createEl("tr");
        let emptyText = searchQuery ? t("study_level_search_empty", searchQuery) : t("study_no_words_for_level");
        const td = tr.createEl("td", { colspan: 8, text: emptyText });
        td.style.cssText = "text-align: center; padding: 20px; color: var(--text-muted);";
        return;
      }

      // 渲染数据行
      for (const item of filtered) {
        const card = item.card;
        const levelNum = item.level;
        const key = item.reviewKey;
        const difficulty = item.difficulty || 1.0;
        const reviewCount = item.reviewCount || 0;

        // 难度系数颜色类
        let diffClass = "difficulty-normal";
        if (difficulty < 0.9) diffClass = "difficulty-easy";
        else if (difficulty > 1.1) diffClass = "difficulty-hard";

        const tr = tbody.createEl("tr");

        // 单词列
        const tdWord = tr.createEl("td");
        tdWord.title = card.word;
        const wordSpan = tdWord.createSpan({ text: card.word });
        wordSpan.className = "library-word";
        wordSpan.addEventListener("click", () => {
          playPronunciation(
            card.word,
            this.plugin.settings.ttsUrlTemplate,
            this.plugin.settings.pronunciationVariant,
            card.lang
          );
        });
        tdWord.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          new WordCopyMenu(this.plugin, card).showAtMouseEvent(e);
        });

        // 音标列
        const tdPhon = tr.createEl("td", { text: card.phonetic || '' });
        tdPhon.title = card.phonetic || '';

        // 释义列
        const def = card.definition || '';
        const shortDef = def.length > 80 ? def.slice(0, 80) + '…' : def;
        const tdDef = tr.createEl("td", { text: shortDef });
        tdDef.title = def;

        // 来源列
        const tdSource = tr.createEl("td", { text: card.sourceFile.split('/').pop() });
        tdSource.title = card.sourceFile;

        // 复习次数列
        const tdReviewCount = tr.createEl("td");
        let countClass = "review-count";

        // 复习次数颜色类
        if (reviewCount >= 9 && levelNum <= 2) {
          // 顽固词：复习很多次但等级很低
          countClass += " stubborn";
        } else if (reviewCount >= 5 && levelNum <= 2) {
          // 吃力词：复习次数不少但等级偏低
          countClass += " struggling";
        } else if (reviewCount <= 5 && levelNum >= 4) {
          // 高效词：复习少但等级高
          countClass += " efficient";
        } else if (reviewCount <= 2) {
          // 新手词：刚开始学习
          countClass += " newbie";
        } else {
          // 稳步词：正常进度（默认）
          countClass += " steady";
        }

        tdReviewCount.className = countClass;
        tdReviewCount.textContent = reviewCount;

        // 难度系数列
        const tdDifficulty = tr.createEl("td");
        tdDifficulty.className = "difficulty-cell";
        // 难度系数颜色类
        if (difficulty <= 0.9) {
          tdDifficulty.classList.add("diff-hard");
        } else if (difficulty >= 1.1) {
          tdDifficulty.classList.add("diff-easy");
        }

        tdDifficulty.textContent = difficulty.toFixed(2);

        // 等级列
        const tdLevel = tr.createEl("td");
        const badge = tdLevel.createSpan({ cls: "study-level-badge" });
        badge.textContent = `${levelNum}`;
        badge.style.cssText = `font-size: 0.7em; font-weight: bold; color: ${levelColors[levelNum] || 'var(--text-muted)'}; background: color-mix(in srgb, ${levelColors[levelNum] || 'var(--text-muted)'} 20%, transparent); padding: 1px 6px; border-radius: 10px; min-width: 24px; text-align: center;`;

        // 操作列
        const tdActions = tr.createEl("td");
        const actions = tdActions.createDiv({ cls: "study-level-actions" });

        if (levelNum >= 5) {
          // 取消掌握按钮
          const unmasterBtn = actions.createEl("button", { text: "↩️", cls: "clickable-icon" });
          unmasterBtn.setAttribute("aria-label", t("notice_mastery_label_on"));
          unmasterBtn.style.cssText = "padding: 0 4px; background: transparent; border: none; cursor: pointer; font-size: 1em; opacity: 0.6; transition: opacity 0.15s;";
          unmasterBtn.addEventListener("mouseenter", () => { unmasterBtn.style.opacity = "1"; });
          unmasterBtn.addEventListener("mouseleave", () => { unmasterBtn.style.opacity = "0.6"; });
          unmasterBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            await this.plugin.masteryStore.setMastered(key, false);
            const review = this.studyStore.getReview(card.word, card.sourceFile);
            if (review) {
              review.level = 0;
              review.difficulty = 1.0;
              review.consecutive = { rating: null, count: 0 };
              review.nextReview = this.studyStore.calculateNextReview(0);
              this.studyStore.setReview(card.word, card.sourceFile, review);
            }
            this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
            renderTable(selectedLevel, searchInput.value.trim().toLowerCase(), sortSelect.value, typeFilterSelect.value);
          });
        } else {
          // 标记掌握按钮
          const masterBtn = actions.createEl("button", { text: "✅", cls: "clickable-icon" });
          masterBtn.setAttribute("aria-label", t("notice_mastery_label_off"));
          masterBtn.style.cssText = "padding: 0 4px; background: transparent; border: none; cursor: pointer; font-size: 1em; opacity: 0.6; transition: opacity 0.15s;";
          masterBtn.addEventListener("mouseenter", () => { masterBtn.style.opacity = "1"; });
          masterBtn.addEventListener("mouseleave", () => { masterBtn.style.opacity = "0.6"; });
          masterBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            await this.plugin.masteryStore.setMastered(key, true);
            const review = this.studyStore.getReview(card.word, card.sourceFile);
            if (review) {
              review.level = 5;
              review.nextReview = null;
              this.studyStore.setReview(card.word, card.sourceFile, review);
            }
            this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
            renderTable(selectedLevel, searchInput.value.trim().toLowerCase(), sortSelect.value, typeFilterSelect.value);
          });
        }

        // 右键菜单
        tr.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          new WordContextMenu(this.plugin, card).showAtMouseEvent(e);
        });

        // 双击编辑
        tr.addEventListener("dblclick", () => {
          const fileSetting = this.plugin.settings.wordbookFiles.find(f => f.path === card.sourceFile);
          if (fileSetting && fileSetting.readonly) {
            new Notice(t("notice_readonly_cannot_edit"));
            return;
          }
          new WordModal(this.plugin.app, this.plugin, card).open();
        });
      }
    };

    // 初始渲染
    renderTable("all", "", "level_desc", "all");

    // 搜索框输入事件
    searchInput.addEventListener("input", () => {
      renderTable(selectedLevel, searchInput.value.trim().toLowerCase(), sortSelect.value, typeFilterSelect.value);
    });

    // 等级筛选事件
    filterSelect.addEventListener("change", (e) => {
      selectedLevel = e.target.value;
      renderTable(selectedLevel, searchInput.value.trim().toLowerCase(), sortSelect.value, typeFilterSelect.value);
    });

    // 排序切换事件
    sortSelect.addEventListener("change", (e) => {
      this._levelSortMode = e.target.value;
      renderTable(selectedLevel, searchInput.value.trim().toLowerCase(), sortSelect.value, typeFilterSelect.value);
    });

    // 类型筛选事件
    typeFilterSelect.addEventListener("change", (e) => {
      this._selectedType = e.target.value;
      renderTable(selectedLevel, searchInput.value.trim().toLowerCase(), sortSelect.value, typeFilterSelect.value);
    });
  }

  // ---------- 统计标签 ----------
  renderStatsTab() {
    const container = this.contentEl;
    container.empty();

    // 使用缓存，避免频繁计算（5秒缓存）
    const now = Date.now();
    if (!this._statsCache || now - this._statsCacheTime > 5000) {
      const allCards = this.plugin.getAllCards();
      this._statsCache = this.studyStore.getStats(allCards);
      this._statsCacheTime = now;
    }
    const stats = this._statsCache;

    // ----- 顶部概览卡片 -----
    const overview = container.createDiv({ cls: "study-stats-overview" });
    const items = [
      { label: t("study_stats_total"), value: stats.total },
      { label: t("study_stats_learning_rate"), value: stats.learningRate.toFixed(1) + "%" },
      { label: t("study_stats_mastered_rate"), value: stats.masteredRate.toFixed(1) + "%" },
      { label: t("study_stats_ignored_rate"), value: stats.ignoredRate.toFixed(1) + "%" },
      { label: t("study_stats_today_progress"), value: (this.studyStore.getTodayStats().reviewed || 0) },
      { label: t("study_stats_streak"), value: t("study_stats_streak_days", stats.streak) }
    ];
    for (const item of items) {
      const card = overview.createDiv({ cls: "stat-card" });
      card.createDiv({ cls: "stat-value", text: String(item.value) });
      card.createDiv({ cls: "stat-label", text: item.label });
    }

    // ----- 图表区域 -----
    const charts = container.createDiv({ cls: "study-charts" });

    // 1. 学习状态分布（环形图）
    const dist = charts.createDiv({ cls: "chart-container" });
    dist.createEl("h4", { text: t("study_stats_learning_distribution") });
    const pie = dist.createDiv({ cls: "pie-chart" });
    const mastered = stats.mastered || 0;
    const learning = stats.learning || 0;
    const ignored = stats.ignored || 0;
    const total = stats.total || 1;
    const masteredPct = mastered / total * 100;
    const learningPct = learning / total * 100;
    const ignoredPct = ignored / total * 100;
    pie.style.background = `conic-gradient(
    var(--color-green) 0% ${masteredPct}%,
    var(--color-blue) ${masteredPct}% ${masteredPct + learningPct}%,
    var(--text-muted) ${masteredPct + learningPct}% 100%
)`;
    pie.style.width = "120px";
    pie.style.height = "120px";
    pie.style.borderRadius = "50%";
    pie.style.margin = "0 auto 10px";

    const legend = dist.createDiv({ cls: "chart-legend" });

    // 学习中 - 蓝色色块
    const learningItem = legend.createSpan();
    const learningDot = learningItem.createSpan({ cls: "color-dot" });
    learningDot.style.backgroundColor = "var(--color-blue)";
    learningDot.style.display = "inline-block";
    learningDot.style.width = "12px";
    learningDot.style.height = "12px";
    learningDot.style.borderRadius = "3px";
    learningDot.style.marginRight = "4px";
    learningItem.append(` ${t("library_status_learning")} (${learning})`);

    // 已掌握 - 绿色色块
    const masteredItem = legend.createSpan();
    const masteredDot = masteredItem.createSpan({ cls: "color-dot" });
    masteredDot.style.backgroundColor = "var(--color-green)";
    masteredDot.style.display = "inline-block";
    masteredDot.style.width = "12px";
    masteredDot.style.height = "12px";
    masteredDot.style.borderRadius = "3px";
    masteredDot.style.marginRight = "4px";
    masteredItem.append(` ${t("library_status_mastered")} (${mastered})`);

    // 已忽略 - 灰色色块
    const ignoredItem = legend.createSpan();
    const ignoredDot = ignoredItem.createSpan({ cls: "color-dot" });
    ignoredDot.style.backgroundColor = "var(--text-muted)";
    ignoredDot.style.display = "inline-block";
    ignoredDot.style.width = "12px";
    ignoredDot.style.height = "12px";
    ignoredDot.style.borderRadius = "3px";
    ignoredDot.style.marginRight = "4px";
    ignoredItem.append(` ${t("library_status_ignored")} (${ignored})`);

    // 2. 学习趋势（折线图）
    const trend = charts.createDiv({ cls: "chart-container" });
    trend.createEl("h4", { text: t("study_stats_trend") });
    const trendData = stats.trend || [];

    // 计算最大值（至少为 1，避免除以 0）
    const maxCount = Math.max(1, ...trendData.map(d => d.count));

    // ---------- 绘制函数 ----------
    function drawTrend(container, data, max) {
      // 移除旧的 SVG（如果有）
      const oldSvg = container.querySelector('svg');
      if (oldSvg) oldSvg.remove();

      const width = 700;
      const height = 130;
      const padding = { top: 12, bottom: 18 };
      const chartH = height - padding.top - padding.bottom;
      const margin = 10;

      // 计算 x 坐标（左右对称边距）
      const getX = (index, total) => {
        const denom = total - 1 || 1;
        return (index / denom) * (width - margin * 2) + margin;
      };

      // 计算 y 坐标
      const getY = (count) => {
        return padding.top + chartH - (count / max) * chartH * 0.9;
      };

      // 创建 SVG
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "trend-svg");
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      container.appendChild(svg);

      // 网格线
      const gridY = [20, 40, 60, 80, 100];
      for (const y of gridY) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", "0");
        line.setAttribute("y1", y);
        line.setAttribute("x2", width);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "var(--background-modifier-border)");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("stroke-dasharray", "4,4");
        svg.appendChild(line);
      }

      // 找出峰值（复习数量的最大值）
      let maxCountValue = -1;
      for (let i = 0; i < data.length; i++) {
        if (data[i].count > maxCountValue) {
          maxCountValue = data[i].count;
        }
      }

      // X 轴刻度与日期标签
      const xLabelStep = 7; // 每 7 天显示一个标签
      const dataLen = data.length;

      for (let i = 0; i < dataLen; i++) {
        // 只在步长点或最后一天（今天）显示标签
        if (i % xLabelStep === 0 || i === dataLen - 1 || (maxCountValue >= 1 && data[i].count === maxCountValue)) {
          const x = getX(i, dataLen);
          const yBase = padding.top + chartH; // 网格线底部Y坐标
          const dataY = getY(data[i].count); // 数据点Y坐标

          // 1. 垂直网格线（浅色虚线）
          const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
          vLine.setAttribute("x1", x);
          vLine.setAttribute("y1", dataY);
          vLine.setAttribute("x2", x);
          vLine.setAttribute("y2", yBase);
          vLine.setAttribute("stroke", "var(--background-modifier-border)");
          vLine.setAttribute("stroke-width", "1.5");
          vLine.setAttribute("stroke-dasharray", "2,2");
          svg.appendChild(vLine);

          // 2. 日期标签（格式：MM-DD）
          const dateStr = data[i].date;
          const month = parseInt(dateStr.slice(5, 7));
          const day = parseInt(dateStr.slice(8, 10));
          const label = `${month}/${day}`;

          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", x);
          text.setAttribute("y", height - padding.bottom + 16); // 日期标签y坐标位置
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("font-size", "10px");
          text.setAttribute("fill", "var(--text-muted)");
          text.textContent = label;

          // 今日或峰值加粗高亮
          if (i === dataLen - 1) {
            // 今日：主题色
            text.setAttribute("font-weight", "bold");
            text.setAttribute("fill", "var(--text-accent)");
          } else if (maxCountValue >= 1 && data[i].count === maxCountValue) {
            // 峰值：绿色
            text.setAttribute("font-weight", "bold");
            text.setAttribute("fill", "var(--color-green)");
          }

          svg.appendChild(text);

          // 3. 显示复习数量
          const countText = document.createElementNS("http://www.w3.org/2000/svg", "text");
          countText.setAttribute("x", x);
          countText.setAttribute("y", dataY - 10);        // 向上偏移 8px，可调
          countText.setAttribute("text-anchor", "middle");
          countText.setAttribute("font-size", "8px");
          countText.setAttribute("fill", "var(--text-muted)");
          countText.setAttribute("opacity", "0.8");
          countText.textContent = data[i].count;

          // 今日或峰值加粗高亮
          if (i === dataLen - 1) {
            // 今日：主题色
            countText.setAttribute("font-weight", "bold");
            countText.setAttribute("fill", "var(--text-accent)");
          } else if (maxCountValue >= 1 && data[i].count === maxCountValue) {
            // 峰值：绿色
            countText.setAttribute("font-weight", "bold");
            countText.setAttribute("fill", "var(--color-green)");
          }

          svg.appendChild(countText);
        }
      }

      // 计算折线坐标
      const points = data.map((d, i) => {
        const x = getX(i, data.length);
        const y = getY(d.count);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      }).join(" ");

      // 面积渐变
      const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      gradient.setAttribute("id", "trendGradient");
      gradient.setAttribute("x1", "0%");
      gradient.setAttribute("y1", "0%");
      gradient.setAttribute("x2", "0%");
      gradient.setAttribute("y2", "100%");
      const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("stop-color", "var(--interactive-accent)");
      stop1.setAttribute("stop-opacity", "0.25");
      const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop2.setAttribute("offset", "100%");
      stop2.setAttribute("stop-color", "var(--interactive-accent)");
      stop2.setAttribute("stop-opacity", "0.02");
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      svg.appendChild(gradient);

      // 面积填充
      const firstPoint = points.split(" ")[0];
      const lastPoint = points.split(" ")[points.split(" ").length - 1];
      const areaPoints = points + ` ${lastPoint.split(",")[0]},${padding.top + chartH + 5} ${firstPoint.split(",")[0]},${padding.top + chartH + 5}`;
      const area = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      area.setAttribute("points", areaPoints);
      area.setAttribute("fill", "url(#trendGradient)");
      area.setAttribute("stroke", "none");
      svg.appendChild(area);

      // 主折线
      const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      polyline.setAttribute("points", points);
      polyline.setAttribute("stroke", "var(--interactive-accent)");
      polyline.setAttribute("stroke-width", "3");
      polyline.setAttribute("stroke-linecap", "round");
      polyline.setAttribute("stroke-linejoin", "round");
      polyline.setAttribute("fill", "none");
      svg.appendChild(polyline);

      // 数据点
      data.forEach((d, i) => {
        const x = getX(i, data.length);
        const y = getY(d.count);

        // 外发光
        const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        glow.setAttribute("cx", x.toFixed(2));
        glow.setAttribute("cy", y.toFixed(2));
        glow.setAttribute("r", "6");
        glow.setAttribute("fill", "var(--interactive-accent)");
        glow.setAttribute("opacity", "0.15");
        svg.appendChild(glow);

        // 主圆点
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x.toFixed(2));
        circle.setAttribute("cy", y.toFixed(2));
        circle.setAttribute("r", "2.5");
        circle.setAttribute("fill", "var(--background-primary)");
        circle.setAttribute("stroke", "var(--interactive-accent)");
        circle.setAttribute("stroke-width", "2");
        svg.appendChild(circle);

        // 今日 + 峰值高亮（空心虚线圆）
        if (i === data.length - 1 || (maxCountValue >= 1 && d.count === maxCountValue)) {
          const highlight = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          highlight.setAttribute("cx", x.toFixed(2));
          highlight.setAttribute("cy", y.toFixed(2));
          highlight.setAttribute("r", "8");
          highlight.setAttribute("fill", "none");

          // 今日或峰值高亮
          if (i === data.length - 1) {
            // 今日：主题色
            highlight.setAttribute("stroke", "var(--interactive-accent)");
          } else if (maxCountValue >= 1 && d.count === maxCountValue) {
            // 峰值：绿色
            highlight.setAttribute("stroke", "var(--color-green)");
          }

          highlight.setAttribute("stroke-width", "1.5");
          highlight.setAttribute("stroke-dasharray", "3,3");
          highlight.setAttribute("opacity", "0.6");
          svg.appendChild(highlight);
        }
      });
    }

    // 绘制
    drawTrend(trend, trendData, maxCount);

    // ----- 趋势图底部说明 -----
    const noteContainer = trend.createDiv({ cls: "trend-note" });
    noteContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px 2px 10px;
    font-size: 0.75em;
    color: var(--text-muted);
    border-top: 1px solid var(--background-modifier-border);
    margin-top: 6px;
    flex-wrap: wrap;
    gap: 4px 12px;
`;

    const todayCount = trendData.length > 0 ? trendData[trendData.length - 1].count : 0;
    const todayLabel = noteContainer.createSpan();
    todayLabel.innerHTML = t("trend_today_label", todayCount).replace(/\{0\}/g, `<strong style="color: var(--text-normal);">${todayCount}</strong>`);

    const totalCount = trendData.reduce((sum, d) => sum + d.count, 0);
    const avgCount = trendData.length > 0 ? Math.round(totalCount / trendData.length) : 0;
    const maxCountDisplay = Math.max(...trendData.map(d => d.count), 0);

    const statsLabel = noteContainer.createSpan();
    statsLabel.innerHTML = t("trend_summary_label", totalCount, avgCount, maxCountDisplay)
      .replace(/\{0\}/g, `<strong style="color: var(--text-normal);">${totalCount}</strong>`)
      .replace(/\{1\}/g, `<strong style="color: var(--text-normal);">${avgCount}</strong>`)
      .replace(/\{2\}/g, `<strong style="color: var(--text-normal);">${maxCountDisplay}</strong>`);


    // 3. 等级分布（条形图）
    const level = charts.createDiv({ cls: "chart-container" });
    level.createEl("h4", { text: t("study_stats_level_distribution") });
    const levelData = stats.levelCounts || [0, 0, 0, 0, 0, 0];
    const levelLabels = ["0", "1", "2", "3", "4", "5"];
    const maxLevel = Math.max(1, ...levelData);
    const barContainer = level.createDiv({ cls: "bar-chart" });

    // 等级0: 蓝色 → 等级1-4: 过渡色 → 等级5: 绿色
    const levelColors = [
      "var(--color-blue)",                                    // 等级0: 纯蓝色
      "color-mix(in srgb, var(--color-blue) 80%, var(--color-green) 20%)",  // 等级1: 蓝多绿少
      "color-mix(in srgb, var(--color-blue) 60%, var(--color-green) 40%)",  // 等级2: 蓝绿平衡偏蓝
      "color-mix(in srgb, var(--color-blue) 40%, var(--color-green) 60%)",  // 等级3: 蓝绿平衡偏绿
      "color-mix(in srgb, var(--color-blue) 20%, var(--color-green) 80%)",  // 等级4: 绿多蓝少
      "var(--color-green)"                                    // 等级5: 纯绿色
    ];

    for (let i = 0; i < levelData.length; i++) {
      const row = barContainer.createDiv({ cls: "bar-row" });
      row.createSpan({ cls: "bar-label", text: levelLabels[i] });
      const barWrap = row.createDiv({ cls: "bar-wrap" });
      const bar = barWrap.createDiv({ cls: "bar-fill" });
      const pct = levelData[i] / maxLevel * 100;
      bar.style.width = pct + "%";
      bar.style.backgroundColor = levelColors[i];
      barWrap.createSpan({ cls: "bar-value", text: levelData[i] });
    }

    // 4. 来源分布（列表）
    const source = charts.createDiv({ cls: "chart-container" });
    source.createEl("h4", { text: t("study_stats_source_distribution") });
    const sourceData = stats.sourceCounts || {};
    const sourceList = source.createDiv({ cls: "source-list" });
    for (const [path, count] of Object.entries(sourceData)) {
      const row = sourceList.createDiv({ cls: "source-item" });
      row.createSpan({ text: path.split('/').pop() });
      row.createSpan({ cls: "count", text: count });
    }

    // 5. 颜色分布
    const color = charts.createDiv({ cls: "chart-container" });
    color.createEl("h4", { text: t("study_stats_color_distribution") });
    const colorData = stats.colorCounts || {};
    const colorList = color.createDiv({ cls: "color-list" });
    const colorMap = {
      red: 'var(--color-red)',
      orange: 'var(--color-orange)',
      yellow: 'var(--color-yellow)',
      green: 'var(--color-green)',
      blue: 'var(--color-blue)',
      purple: 'var(--color-purple)',
      pink: 'var(--color-pink)',
      cyan: 'var(--color-cyan)'
    };
    for (const [col, count] of Object.entries(colorData)) {
      const row = colorList.createDiv({ cls: "color-item" });

      // 色块 + 颜色名称
      const leftGroup = row.createSpan({ cls: "color-item-left" });
      const dot = leftGroup.createSpan({ cls: "color-dot" });
      const colVal = colorMap[col] || 'var(--interactive-accent)';
      dot.style.backgroundColor = colVal;

      let colorName;
      if (col === 'default' || col === '') {
        colorName = t("color_default");
      } else {
        const translated = t("color_" + col);
        colorName = (translated !== "color_" + col) ? translated : col;
      }
      leftGroup.append(` ${colorName}`);

      // 计数
      const countSpan = row.createSpan({ cls: "count", text: count });
    }
  }

  // ---------- 设置标签 ----------
  renderSettingsTab() {
    const container = this.contentEl;
    container.empty();
    const settings = this.plugin.settings.study;

    container.createEl("h3", { text: "⚙️ " + t("study_settings_title") });

    // 每日目标
    const goalSetting = container.createDiv({ cls: "study-setting-item" });
    goalSetting.createDiv({ cls: "study-setting-label", text: t("study_settings_daily_goal") });
    goalSetting.createDiv({ cls: "study-setting-desc", text: t("study_settings_daily_goal_desc") });
    const goalControl = goalSetting.createDiv({ cls: "study-setting-control" });
    const goalInput = goalControl.createEl("input", { type: "number" });
    goalInput.value = settings.dailyGoal;
    goalInput.min = 1;
    goalInput.max = 999;
    goalInput.step = 1;
    goalInput.style.width = "80px";
    goalInput.addEventListener("change", async (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;

      // 获取单次复习上限
      const limit = settings.dailyReviewLimit || 20;
      // 如果每日目标 > 单次复习上限，强制限制并提示
      if (val > limit) {
        val = limit;
        new Notice(t("study_goal_cannot_exceed_limit", limit));
        goalInput.value = val;
      }
      if (val > 999) val = 999;

      settings.dailyGoal = val;
      this.plugin.settings.study.dailyGoal = val;
      await this.plugin.saveSettings();
      this.studyStore.data.dailyGoal = val;
      await this.studyStore.save();
      this.updateTopBar();
      this.plugin.app.workspace.trigger("simple-wordbook:settings-updated");
    });

    // 单次复习上限
    const limitSetting = container.createDiv({ cls: "study-setting-item" });
    limitSetting.createDiv({ cls: "study-setting-label", text: t("study_settings_daily_limit") });
    limitSetting.createDiv({ cls: "study-setting-desc", text: t("study_settings_daily_limit_desc") });
    const limitControl = limitSetting.createDiv({ cls: "study-setting-control" });
    const limitInput = limitControl.createEl("input", { type: "number" });
    limitInput.value = settings.dailyReviewLimit;
    limitInput.min = 1;
    limitInput.max = 999;
    limitInput.step = 1;
    limitInput.style.width = "80px";
    limitInput.addEventListener("change", async (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 999) val = 999;

      settings.dailyReviewLimit = val;
      this.plugin.settings.study.dailyReviewLimit = val;
      await this.plugin.saveSettings();

      // 如果每日目标大于新的单次复习上限，自动调低每日目标
      const goal = settings.dailyGoal || 10;
      if (goal > val) {
        settings.dailyGoal = val;
        this.plugin.settings.study.dailyGoal = val;
        this.studyStore.data.dailyGoal = val;
        await this.plugin.saveSettings();
        await this.studyStore.save();
        goalInput.value = val;
        this.updateTopBar();
        new Notice(t("study_goal_adjusted_to_limit", val));
      }
    });

    // 自动翻转（秒）
    const autoFlipSetting = container.createDiv({ cls: "study-setting-item" });
    autoFlipSetting.createDiv({ cls: "study-setting-label", text: t("study_settings_flashcard_autoflip") });
    autoFlipSetting.createDiv({ cls: "study-setting-desc", text: t("study_settings_flashcard_autoflip_desc") });
    const autoFlipControl = autoFlipSetting.createDiv({ cls: "study-setting-control" });
    const autoFlipSelect = autoFlipControl.createEl("select");
    const autoOptions = [0, 1, 2, 3, 5];
    for (const v of autoOptions) {
      const label = String(v);
      const opt = autoFlipSelect.createEl("option", { value: String(v), text: label });
      if (v === settings.flashcardAutoFlip) opt.selected = true;
    }
    autoFlipSelect.addEventListener("change", async (e) => {
      settings.flashcardAutoFlip = parseInt(e.target.value);
      this.plugin.settings.study.flashcardAutoFlip = settings.flashcardAutoFlip;
      await this.plugin.saveSettings();
    });

    // 新词补充顺序
    const newWordOrderSetting = container.createDiv({ cls: "study-setting-item" });
    newWordOrderSetting.createDiv({ cls: "study-setting-label", text: t("study_settings_new_word_order") });
    newWordOrderSetting.createDiv({ cls: "study-setting-desc", text: t("study_settings_new_word_order_desc") });
    const newWordOrderControl = newWordOrderSetting.createDiv({ cls: "study-setting-control" });
    const newWordOrderSelect = newWordOrderControl.createEl("select");
    newWordOrderSelect.createEl("option", { value: "sequential", text: t("study_new_word_order_sequential") });
    newWordOrderSelect.createEl("option", { value: "random", text: t("study_new_word_order_random") });
    newWordOrderSelect.value = settings.newWordOrder || "sequential";
    newWordOrderSelect.addEventListener("change", async (e) => {
      settings.newWordOrder = e.target.value;
      this.plugin.settings.study.newWordOrder = settings.newWordOrder;
      await this.plugin.saveSettings();
    });

    // 复习排序
    const orderSetting = container.createDiv({ cls: "study-setting-item" });
    orderSetting.createDiv({ cls: "study-setting-label", text: t("study_settings_review_order") });
    orderSetting.createDiv({ cls: "study-setting-desc", text: t("study_settings_review_order_desc") }); 
    const orderControl = orderSetting.createDiv({ cls: "study-setting-control" });
    const orderSelect = orderControl.createEl("select");
    orderSelect.createEl("option", { value: "due_first", text: t("study_settings_review_order_due") });
    orderSelect.createEl("option", { value: "level_high_first", text: t("study_settings_review_order_high_level") });
    orderSelect.createEl("option", { value: "level_low_first", text: t("study_settings_review_order_low_level") });
    orderSelect.value = settings.reviewOrder || "due_first";
    orderSelect.addEventListener("change", async (e) => {
      settings.reviewOrder = e.target.value;
      this.plugin.settings.study.reviewOrder = settings.reviewOrder;
      await this.plugin.saveSettings();
    });

    // 显示音标（开关）
    const phoneticSetting = container.createDiv({ cls: "study-setting-item" });
    phoneticSetting.createDiv({ cls: "study-setting-label", text: t("study_settings_flashcard_phonetic") });
    phoneticSetting.createDiv({ cls: "study-setting-desc", text: t("study_settings_flashcard_phonetic_desc") });
    const phoneticControl = phoneticSetting.createDiv({ cls: "study-setting-control" });
    const phoneticToggle = phoneticControl.createDiv({ cls: "checkbox-container2" });
    if (settings.flashcardShowPhonetic !== false) phoneticToggle.addClass("is-enabled");
    phoneticToggle.createDiv({ cls: "checkbox-handle" });
    phoneticToggle.addEventListener("click", async () => {
      const newVal = !settings.flashcardShowPhonetic;
      settings.flashcardShowPhonetic = newVal;
      this.plugin.settings.study.flashcardShowPhonetic = newVal;
      await this.plugin.saveSettings();
      phoneticToggle.toggleClass("is-enabled", newVal);
    });

    // 释义以标签页显示（开关）
    const tabsSetting = container.createDiv({ cls: "study-setting-item" });
    tabsSetting.createDiv({ cls: "study-setting-label", text: t("study_settings_flashcard_tabs") });
    tabsSetting.createDiv({ cls: "study-setting-desc", text: t("study_settings_flashcard_tabs_desc") });
    const tabsControl = tabsSetting.createDiv({ cls: "study-setting-control" });
    const tabsToggle = tabsControl.createDiv({ cls: "checkbox-container2" });
    if (settings.flashcardShowTabs !== false) tabsToggle.addClass("is-enabled");
    tabsToggle.createDiv({ cls: "checkbox-handle" });
    tabsToggle.addEventListener("click", async () => {
      const newVal = !settings.flashcardShowTabs;
      settings.flashcardShowTabs = newVal;
      this.plugin.settings.study.flashcardShowTabs = newVal;
      await this.plugin.saveSettings();
      tabsToggle.toggleClass("is-enabled", newVal);
    });

    // 启用精细反馈（4 按钮）
    const fineFeedbackSetting = container.createDiv({ cls: "study-setting-item" });
    fineFeedbackSetting.createDiv({ cls: "study-setting-label", text: t("settings_enable_fine_feedback") });
    fineFeedbackSetting.createDiv({ cls: "study-setting-desc", text: t("settings_enable_fine_feedback_desc") });
    const fineFeedbackControl = fineFeedbackSetting.createDiv({ cls: "study-setting-control" });
    const fineFeedbackToggle = fineFeedbackControl.createDiv({ cls: "checkbox-container2" });
    if (this.plugin.settings.study.enableFineFeedback) fineFeedbackToggle.addClass("is-enabled");
    fineFeedbackToggle.createDiv({ cls: "checkbox-handle" });
    fineFeedbackToggle.addEventListener("click", async () => {
      const newVal = !this.plugin.settings.study.enableFineFeedback;
      this.plugin.settings.study.enableFineFeedback = newVal;
      await this.plugin.saveSettings();
      fineFeedbackToggle.toggleClass("is-enabled", newVal);
    });

    // 间隔天数自定义
    const intervalSetting = container.createDiv({ cls: "study-setting-item" });
    const headerRow = intervalSetting.createDiv({ cls: "study-interval-header" });
    headerRow.createDiv({ cls: "study-setting-label", text: t("study_settings_intervals") });
    const resetIntervalBtn = headerRow.createEl("button", { cls: "study-interval-reset-btn", text: t("study_intervals_reset") });
    intervalSetting.createDiv({ cls: "study-setting-desc", text: t("study_settings_intervals_desc") });
    const inputRow = intervalSetting.createDiv({ cls: "study-interval-input-row" });

    const labels = ["L0", "L1", "L2", "L3", "L4"];
    const defaultIntervals = [1, 2, 4, 8, 16];
    const currentIntervals = settings.intervalDays || defaultIntervals;
    const inputs = [];

    for (let i = 0; i < 5; i++) {
      const group = inputRow.createDiv({ cls: "study-interval-group" });

      group.createSpan({ cls: "study-interval-group-label", text: labels[i] });

      const input = group.createEl("input", { type: "number", cls: "study-interval-input" });
      input.value = currentIntervals[i] ?? defaultIntervals[i];
      input.min = 1;
      input.max = 365;
      input.step = 1;

      inputs.push(input);

      input.addEventListener("change", async () => {
        const newIntervals = inputs.map(inp => {
          let val = parseInt(inp.value);
          if (isNaN(val) || val < 1) val = 1;
          if (val > 365) val = 365;
          inp.value = val;
          return val;
        });
        settings.intervalDays = newIntervals;
        this.plugin.settings.study.intervalDays = newIntervals;
        await this.plugin.saveSettings();
        new Notice(t("study_intervals_updated_notice"));
      });
    }

    // 恢复默认按钮点击事件
    resetIntervalBtn.addEventListener("click", async () => {
      for (let i = 0; i < 5; i++) {
        inputs[i].value = defaultIntervals[i];
      }
      settings.intervalDays = [...defaultIntervals];
      this.plugin.settings.study.intervalDays = [...defaultIntervals];
      await this.plugin.saveSettings();

      inputs.forEach(inp => {
        inp.style.borderColor = "var(--interactive-accent)";
        inp.style.transition = "border-color 0.3s";
        setTimeout(() => {
          inp.style.borderColor = "";
        }, 800);
      });

      new Notice(t("study_intervals_reset_notice"));
    });

    // 重置进度
    const resetSetting = container.createDiv({ cls: "study-setting-item" });
    resetSetting.createDiv({ cls: "study-setting-label", text: t("study_reset_progress") });
    resetSetting.createDiv({ cls: "study-setting-desc", text: t("study_reset_desc") });
    const resetControl = resetSetting.createDiv({ cls: "study-setting-control" });
    const resetBtn = resetControl.createEl("button", { text: t("study_reset_progress"), cls: "mod-warning" });
    resetBtn.addEventListener("click", async () => {
      if (confirm(t("study_reset_confirm"))) {
        await this.studyStore.resetAll();
        new Notice(t("study_reset_success"));
        this.refresh();
      }
    });

    // 高级算法参数
    //const hr = container.createEl("hr");
    //hr.style.cssText = "border: none; border-top: 1px solid var(--background-modifier-border); margin: 20px 0;";
    const spacer = container.createDiv();
    spacer.style.cssText = "height: 12px;";

    // 折叠标题栏
    const toggleContainer = container.createDiv({ cls: "study-params-toggle" });
    const toggleIcon = toggleContainer.createSpan({ text: "▶", cls: "toggle-icon" });
    const toggleTitle = toggleContainer.createSpan({ text: t("study_params_advanced"), cls: "toggle-title" });

    // 内容区域（默认折叠）
    const contentArea = container.createDiv({ cls: "study-params-content" });

    // 切换展开/折叠
    let isExpanded = false;
    toggleContainer.addEventListener("click", () => {
      isExpanded = !isExpanded;
      toggleIcon.textContent = isExpanded ? "▼" : "▶";
      contentArea.toggleClass("expanded", isExpanded);
    });

    // 内容：所有参数
    const getParams = () => this.plugin.settings.studyParams || DEFAULT_SETTINGS.studyParams;
    let params = getParams();

    const formContainer = contentArea.createDiv({ cls: "study-params-form" });

    // 1. 基础系数 (baseDelta)
    const baseRow = formContainer.createDiv({ cls: "study-param-group" });
    const baseTitleRow = baseRow.createDiv({ cls: "study-param-title" });
    baseTitleRow.createSpan({ text: t("study_params_baseDelta") });

    const baseInputRow = baseRow.createDiv({ cls: "study-param-input-row" });
    const baseInputs = {};
    const baseKeys = ['again', 'hard', 'good', 'easy'];
    const baseLabelKeys = ['again', 'hard', 'good', 'easy'];
    for (let i = 0; i < baseKeys.length; i++) {
      const key = baseKeys[i];
      baseInputRow.createSpan({ text: t("study_params_" + baseLabelKeys[i]), cls: "study-param-label" });
      const input = baseInputRow.createEl("input", { type: "number", cls: "study-param-input", value: params.baseDelta?.[key] ?? 0 });
      input.step = 0.01;
      baseInputs[key] = input;
    }

    // 2. 额外系数 (extraDelta) + 奖励阈值
    const extraRow = formContainer.createDiv({ cls: "study-param-group" });
    const extraTitleRow = extraRow.createDiv({ cls: "study-param-title" });
    extraTitleRow.createSpan({ text: t("study_params_extraDelta") });

    const extraInputRow = extraRow.createDiv({ cls: "study-param-input-row" });
    const extraInputs = {};
    extraInputRow.createSpan({ text: t("study_params_good"), cls: "study-param-label" });
    const extraGood = extraInputRow.createEl("input", { type: "number", cls: "study-param-input", value: params.extraDelta?.good ?? 0.05 });
    extraGood.step = 0.01;
    extraInputs['good'] = extraGood;

    extraInputRow.createSpan({ text: t("study_params_easy"), cls: "study-param-label" });
    const extraEasy = extraInputRow.createEl("input", { type: "number", cls: "study-param-input", value: params.extraDelta?.easy ?? 0.03 });
    extraEasy.step = 0.01;
    extraInputs['easy'] = extraEasy;

    extraInputRow.createSpan({ text: t("study_params_threshold"), cls: "study-param-label" });
    const thresholdInput = extraInputRow.createEl("input", { type: "number", cls: "study-param-input", value: params.rewardThreshold ?? 3 });
    thresholdInput.min = 1;
    thresholdInput.max = 20;

    // 3. 难易系数范围
    const rangeRow = formContainer.createDiv({ cls: "study-param-group" });
    const rangeTitleRow = rangeRow.createDiv({ cls: "study-param-title" });
    rangeTitleRow.createSpan({ text: t("study_params_range") });

    const rangeInputRow = rangeRow.createDiv({ cls: "study-param-input-row" });
    rangeInputRow.createSpan({ text: t("study_params_min"), cls: "study-param-label" });
    const minInput = rangeInputRow.createEl("input", { type: "number", cls: "study-param-input", value: params.difficultyMin ?? 0.7 });
    minInput.step = 0.05;

    rangeInputRow.createSpan({ text: t("study_params_max"), cls: "study-param-label" });
    const maxInput = rangeInputRow.createEl("input", { type: "number", cls: "study-param-input", value: params.difficultyMax ?? 1.5 });
    maxInput.step = 0.05;

    // 4. 搁置参数 (suspend)
    const defaultAgain = params.suspend?.again || [
      { threshold: 3, days: 4 },
      { threshold: 6, days: 8 },
      { threshold: 9, days: 30 }
    ];
    const defaultHard = params.suspend?.hard || [
      { threshold: 3, days: 3 },
      { threshold: 6, days: 5 },
      { threshold: 9, days: 15 }
    ];

    const thresholdInputs = [];
    const againDayInputs = [];
    const hardDayInputs = [];

    const suspendGroup = formContainer.createDiv({ cls: "study-param-group" });

    // 标题行
    const suspendTitleRow = suspendGroup.createDiv({ cls: "study-param-title" });
    suspendTitleRow.createSpan({ text: t("study_params_suspend") });

    // 4.1 搁置触发阈值
    const thresholdRow = suspendGroup.createDiv({ cls: "study-param-input-row" });
    thresholdRow.createSpan({ text: t("study_params_suspend_thresholds"), cls: "study-param-label" });

    for (let i = 0; i < defaultAgain.length; i++) {
      const entry = defaultAgain[i];
      if (i > 0) thresholdRow.createSpan({ text: "  ", cls: "study-param-spacer" });
      const tInput = thresholdRow.createEl("input", { type: "number", cls: "study-param-input", value: entry.threshold });
      tInput.min = 1;
      thresholdInputs.push(tInput);
    }

    // 4.2 忘记搁置天数
    const againRow = suspendGroup.createDiv({ cls: "study-param-input-row" });
    againRow.createSpan({ text: t("study_params_suspend_again"), cls: "study-param-label" });

    for (let i = 0; i < defaultAgain.length; i++) {
      const entry = defaultAgain[i];
      if (i > 0) againRow.createSpan({ text: "  ", cls: "study-param-spacer" });
      const dInput = againRow.createEl("input", { type: "number", cls: "study-param-input", value: entry.days });
      dInput.min = 0;
      dInput.max = 365;
      againDayInputs.push(dInput);
    }

    // 4.3 困难搁置天数
    const hardRow = suspendGroup.createDiv({ cls: "study-param-input-row" });
    hardRow.createSpan({ text: t("study_params_suspend_hard"), cls: "study-param-label" });

    for (let i = 0; i < defaultHard.length; i++) {
      const entry = defaultHard[i];
      if (i > 0) hardRow.createSpan({ text: "  ", cls: "study-param-spacer" });
      const dInput = hardRow.createEl("input", { type: "number", cls: "study-param-input", value: entry.days });
      dInput.min = 0;
      dInput.max = 365;
      hardDayInputs.push(dInput);
    }

    // 5. 参数说明
    const helpGroup = formContainer.createDiv({ cls: "study-param-group" });

    // 标题行
    const helpTitleRow = helpGroup.createDiv({ cls: "study-param-title" });
    helpTitleRow.createSpan({ text: t("study_params_help_title") });

    // 内容行
    const helpContent = helpGroup.createDiv();
    helpContent.style.cssText = "font-size: 0.8em; color: var(--text-muted); line-height: 1.6;";

    const updateHelp = (p) => {
      const threshold = p.rewardThreshold ?? 3;
      const minDiff = p.difficultyMin ?? 0.7;
      const maxDiff = p.difficultyMax ?? 1.5;
      helpContent.innerHTML = `
    • ${t("study_params_help_baseDelta")}<br>
    • ${t("study_params_help_extraDelta", threshold)}<br>
    • ${t("study_params_help_suspend")}<br>
    • ${t("study_params_help_threshold_note")}
  `;
    };
    updateHelp(params);

    // 6. 重置按钮
    const resetRow = formContainer.createDiv({ cls: "study-param-reset-row" });
    const paramsResetBtn = resetRow.createEl("button", { text: t("study_params_reset") });

    paramsResetBtn.addEventListener("click", async () => {
      if (!confirm(t("study_params_reset_confirm"))) return;

      const defaultParams = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.studyParams));
      this.plugin.settings.studyParams = defaultParams;
      await this.plugin.saveSettings();
      params = defaultParams;

      for (const key of baseKeys) {
        baseInputs[key].value = defaultParams.baseDelta?.[key] ?? 0;
      }
      extraInputs['good'].value = defaultParams.extraDelta?.good ?? 0.05;
      extraInputs['easy'].value = defaultParams.extraDelta?.easy ?? 0.03;
      thresholdInput.value = defaultParams.rewardThreshold ?? 3;
      minInput.value = defaultParams.difficultyMin ?? 0.7;
      maxInput.value = defaultParams.difficultyMax ?? 1.5;

      const defAgain = defaultParams.suspend?.again || [];
      for (let i = 0; i < thresholdInputs.length && i < defAgain.length; i++) {
        thresholdInputs[i].value = defAgain[i].threshold;
      }
      for (let i = 0; i < againDayInputs.length && i < defAgain.length; i++) {
        againDayInputs[i].value = defAgain[i].days;
      }
      const defHard = defaultParams.suspend?.hard || [];
      for (let i = 0; i < hardDayInputs.length && i < defHard.length; i++) {
        hardDayInputs[i].value = defHard[i].days;
      }

      updateHelp(defaultParams);
      new Notice(t("study_params_reset_success"));
    });

    // 7. 自动保存：所有输入框 change 事件
    const saveAllParams = async () => {
      const baseDelta = {};
      for (const key of baseKeys) {
        baseDelta[key] = parseFloat(baseInputs[key].value) || 0;
      }

      const extraDelta = {
        good: parseFloat(extraInputs['good'].value) || 0,
        easy: parseFloat(extraInputs['easy'].value) || 0
      };

      const difficultyMin = parseFloat(minInput.value) || 0.7;
      const difficultyMax = parseFloat(maxInput.value) || 1.5;
      const rewardThreshold = parseInt(thresholdInput.value) || 3;

      const againEntries = thresholdInputs.map((tInput, idx) => ({
        threshold: parseInt(tInput.value) || 1,
        days: parseInt(againDayInputs[idx]?.value) || 0
      })).filter(e => e.threshold > 0 && e.days > 0);
      againEntries.sort((a, b) => a.threshold - b.threshold);

      const hardEntries = thresholdInputs.map((tInput, idx) => ({
        threshold: parseInt(tInput.value) || 1,
        days: parseInt(hardDayInputs[idx]?.value) || 0
      })).filter(e => e.threshold > 0 && e.days > 0);
      hardEntries.sort((a, b) => a.threshold - b.threshold);

      const againThresholds = againEntries.map(e => e.threshold);
      const hardThresholds = hardEntries.map(e => e.threshold);
      if (new Set(againThresholds).size !== againThresholds.length) {
        new Notice(t("study_params_apply_threshold_duplicate"));
        return;
      }
      if (new Set(hardThresholds).size !== hardThresholds.length) {
        new Notice(t("study_params_apply_threshold_duplicate"));
        return;
      }

      if (difficultyMin >= difficultyMax) {
        new Notice(t("study_params_import_minmax"));
        return;
      }

      const newParams = {
        baseDelta,
        extraDelta,
        difficultyMin,
        difficultyMax,
        rewardThreshold,
        suspend: {
          again: againEntries,
          hard: hardEntries
        }
      };

      this.plugin.settings.studyParams = newParams;
      await this.plugin.saveSettings();
      params = newParams;
      updateHelp(newParams);
    };

    // 绑定 change 事件
    for (const key of baseKeys) {
      baseInputs[key].addEventListener('change', saveAllParams);
    }
    extraGood.addEventListener('change', saveAllParams);
    extraEasy.addEventListener('change', saveAllParams);
    thresholdInput.addEventListener('change', saveAllParams);
    minInput.addEventListener('change', saveAllParams);
    maxInput.addEventListener('change', saveAllParams);
    for (const inp of thresholdInputs) {
      inp.addEventListener('change', saveAllParams);
    }
    for (const inp of againDayInputs) {
      inp.addEventListener('change', saveAllParams);
    }
    for (const inp of hardDayInputs) {
      inp.addEventListener('change', saveAllParams);
    }
  }
}

// ========== 辅助类 ==========
class ConfirmModal extends Modal {
  constructor(app, onConfirm, onCancel, message = null, confirmText = null, cancelText = null, title = null) {
    super(app);
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;
    this.message = message;
    this.confirmText = confirmText || t("confirm");
    this.cancelText = cancelText || t("cancel");
    this.title = title;
  }
  onOpen() {
    const { contentEl, titleEl } = this;
    // 如果传入了标题，则设置标题
    if (this.title) {
      titleEl.setText(this.title);
    }
    const msg = this.message || t("delete_confirm");
    contentEl.createEl("p", { text: msg });
    const buttonDiv = contentEl.createDiv({ cls: "modal-button-container" });
    const confirmBtn = buttonDiv.createEl("button", { text: this.confirmText, cls: "mod-cta" });
    const cancelBtn = buttonDiv.createEl("button", { text: this.cancelText });
    confirmBtn.addEventListener("click", () => { this.close(); this.onConfirm(); });
    cancelBtn.addEventListener("click", () => { this.close(); this.onCancel(); });
  }
}

// ========== 导出辅助函数 ==========

// ---------- 导出专用的章节解析 ----------
function parseSectionsForExport(definition) {
  if (!definition || !definition.trim()) return [{ title: t("section_default_title"), content: "" }];

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
      // 无标题：与 parseSections 逻辑一致
      title = sections.length === 0 ? t("section_default_title") : `${t("section_content_prefix")} ${sections.length + 1}`;
      content = trimmed;
    }
    sections.push({ title, content });
  }

  if (sections.length === 0) {
    sections.push({ title: t("section_default_title"), content: definition });
  }

  return sections;
}

// ---------- 将 Markdown 转换为 HTML（用于 Anki 导出） ----------
function markdownToHtml(text) {
  if (!text) return '';
  // 粗体：**content** → <b>content</b>
  let html = text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  // 换行：真实换行符 → <br>
  html = html.replace(/\n/g, '<br>');
  return html;
}

// ---------- TSV 字段转义：双引号包裹，内部双引号转义为 "" ----------
function escapeField(str) {
  if (str == null) return '""';
  return `"${String(str).replace(/"/g, '""')}"`;
}

// ---------- 获取卡片的显示状态（Markdown） ----------
function getStatusLabel(card, plugin) {
  const key = getStudyKey(card.word, card.sourceFile);
  if (plugin.masteryStore.isIgnored(key)) return t("export_status_ignored");
  if (plugin.masteryStore.isMastered(key)) return t("export_status_mastered");
  return t("export_status_learning");
}

// ---------- 获取卡片的英文状态（用于 Anki TSV） ----------
function getStatusEn(card, plugin) {
  const key = getStudyKey(card.word, card.sourceFile);
  if (plugin.masteryStore.isIgnored(key)) return "Ignored";
  if (plugin.masteryStore.isMastered(key)) return "Mastered";
  return "Learning";
}

// ---------- 生成 Markdown 导出内容 ----------
function generateMarkdownContent(cards, fileName, options, plugin) {
  const lines = [`# ${fileName}`, ''];

  for (const card of cards) {
    lines.push(`## ${card.word}`, '');

    if (options.includePhonetic) {
      lines.push(`**${t("export_phonetic_label")}** ${card.phonetic || ''}`, '');
    }

    if (options.includeAliases && card.aliases && card.aliases.length > 0) {
      lines.push(`**${t("export_aliases_label")}** ${card.aliases.join(', ')}`, '');
    }

    if (options.includeSource) {
      const source = card.sourceFile?.split('/').pop() || '';
      lines.push(`**${t("export_source_label")}** ${source}`, '');
    }

    if (options.includeStatus) {
      const status = getStatusLabel(card, plugin);
      lines.push(`**${t("export_status_label")}** ${status}`, '');
    }

    // 导出 lang 字段（仅当有值时才输出）
    if (options.includeLang && card.lang) {
      lines.push(`**${t("export_lang_label")}** ${card.lang}`, '');
    }

    // 解析并输出定义章节
    if (options.includeDefinition) {
      const sections = parseSectionsForExport(card.definition || '');
      for (const section of sections) {
        lines.push(`**${section.title}**`);
        lines.push('');
        lines.push(section.content);
        lines.push('');
      }
    }

    lines.push('---', '');
  }

  return lines.join('\n');
}

// ---------- 拆分定义为所有章节，保留原始内容，返回所有章节数组，供 Anki 动态列导出使用 ----------
function splitDefinitionForExport(definition) {
  if (!definition) return [];

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
      // 无标题：作为"释义"
      title = t("section_default_title");
      content = trimmed;
    }
    sections.push({ title, content });
  }

  if (sections.length === 0) {
    sections.push({ title: t("section_default_title"), content: definition });
  }

  return sections;
}

// ---------- 生成 Anki TSV 导出内容（释义内容动态列结构） ----------
function generateAnkiTsvContent(cards, options, plugin) {
  if (cards.length === 0) return '';

  // 收集所有章节标题（仅当包含释义时）
  const allTitles = [];
  const seenTitles = new Set();
  if (options.includeDefinition) {
    for (const card of cards) {
      const sections = splitDefinitionForExport(card.definition || '');
      for (const section of sections) {
        if (!seenTitles.has(section.title)) {
          seenTitles.add(section.title);
          allTitles.push(section.title);
        }
      }
    }
  }

  const lines = [];

  for (const card of cards) {
    const sections = splitDefinitionForExport(card.definition || '');
    const contentMap = {};
    for (const section of sections) {
      contentMap[section.title] = section.content;
    }

    // 构建原始字段数组（无转义）
    const rawFields = [];

    // 单词（始终包含）
    rawFields.push(card.word);

    // 仅当选项开启时包含音标（音标为空，填空字符串占位）
    if (options.includePhonetic) {
      rawFields.push(card.phonetic || '');
    }

    // 仅当选项开启时包含别名（别名为空，填空字符串占位）
    if (options.includeAliases) {
      rawFields.push((card.aliases && card.aliases.length > 0) ? card.aliases.join(', ') : '');
    }

    // 仅当包含释义时才添加章节字段
    if (options.includeDefinition) {
      for (const title of allTitles) {
        const rawContent = contentMap[title] || '';
        const fullContent = `**${title}**\n${rawContent}`;
        const processed = options.convertToHtml ? markdownToHtml(fullContent) : fullContent;
        rawFields.push(processed);
      }
    }

    // 仅当选项开启时包含来源
    if (options.includeSource) {
      rawFields.push(card.sourceFile?.split('/').pop() || '');
    }

    // 仅当选项开启时包含状态
    if (options.includeStatus) {
      rawFields.push(getStatusEn(card, plugin));
    }

    // 仅当选项开启时包含 lang 字符（无值则填空字符串）
    if (options.includeLang) {
      rawFields.push(card.lang || '');
    }

    // 根据 oneLinePerWord 选项决定最终字段字符串
    let finalFields;
    if (options.oneLinePerWord) {
      // 无引号，替换换行和制表符为空格
      finalFields = rawFields.map(f => {
        let str = String(f);
        str = str.replace(/[\n\r\t]+/g, ' ');
        return str;
      });
    } else {
      // 标准 TSV：使用 escapeField 加引号，保留换行
      finalFields = rawFields.map(f => escapeField(f));
    }

    lines.push(finalFields.join('\t'));
  }

  return lines.join('\n');
}

// ========== 添加/编辑单词的模态框 ==========
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
    this.lang = existingCard?.lang || "";
    this.defTextArea = null;  // 保存释义文本域引用
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("wordbook-add-edit-modal");
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

    // ===== 释义框设置 =====
    const defSetting = new Setting(contentEl).setName(t("definition_label"));
    const controlEl = defSetting.controlEl;
    controlEl.empty(); // 清空默认占位，用自定义布局

    // 包裹容器（相对定位）
    const wrapper = controlEl.createDiv();
    wrapper.style.cssText = 'position: relative; width: 100%;';

    // 文本域
    const textArea = wrapper.createEl('textarea');
    textArea.value = this.definition;
    textArea.placeholder = t("definition_placeholder");
    textArea.rows = 6;
    textArea.style.cssText = `
  width: 100%;
  min-height: 200px;
  padding: 8px 36px 8px 8px;
  border-radius: 4px;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
  color: var(--text-normal);
  resize: vertical;
  font-family: var(--font-text);
`;
    textArea.addEventListener('input', () => {
      this.definition = textArea.value;
    });
    this.defTextArea = textArea; // 保存引用

    // 右上角浮动图标按钮
    const fetchBtn = wrapper.createEl('button');
    setIcon(fetchBtn, 'quote');
    fetchBtn.setAttribute('aria-label', t("example_fetch_btn"));
    fetchBtn.style.cssText = `
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
`;

    // ---- 检测当前是否在编辑模式（使用 getMode） ----
    const leaf = this.app.workspace.activeLeaf;
    let isEditMode = false;
    if (leaf && leaf.view) {
      const view = leaf.view;
      if (view.getViewType && view.getViewType() === 'markdown') {
        // 使用 getMode 方法
        if (typeof view.getMode === 'function') {
          isEditMode = view.getMode() === 'source';
        } else {
          // 降级方案：检查 editor 和 previewMode
          isEditMode = !!view.editor && view.previewMode === false;
        }
      }
    }

    if (!isEditMode) {
      // 非编辑模式：禁用按钮，变为灰色
      fetchBtn.disabled = true;
      fetchBtn.style.opacity = '0.3';
      fetchBtn.style.cursor = 'not-allowed';
      fetchBtn.setAttribute('aria-label', t("example_edit_only"));
    } else {
      // 编辑模式：正常事件
      fetchBtn.addEventListener('mouseenter', () => {
        fetchBtn.style.background = 'var(--background-modifier-hover)';
        fetchBtn.style.color = 'var(--text-normal)';
      });
      fetchBtn.addEventListener('mouseleave', () => {
        fetchBtn.style.background = 'transparent';
        fetchBtn.style.color = 'var(--text-muted)';
      });
      fetchBtn.addEventListener('click', () => {
        const sentence = this.plugin.getSelectedSentence('paragraph', this.word);
        if (!sentence) {
          new Notice(t("example_no_sentence"));
        }
        const defaultTitle = t("example_section_title");
        new SentencePickerModal(
          this.app,
          this.plugin,
          sentence,
          this.word,
          (finalText, customTitle) => {
            this.appendExample(finalText, customTitle);
          },
          'paragraph', // 默认模式，按空行分隔提取
          defaultTitle
        ).open();
      });
    }

    new Setting(contentEl).setName(t("aliases_label")).addText(text => {
      text.setValue(this.aliasesStr);
      text.onChange(val => this.aliasesStr = val);
      text.inputEl.placeholder = "e.g. takes, took, taken, taking";
    });

    new Setting(contentEl).setName(t("word_lang_label"))
      .setDesc(t("word_lang_desc"))
      .addDropdown(drop => {
        const languages = this.plugin.settings.languages || [];
        drop.addOption('', t("color_default"));
        for (const lang of languages) {
          drop.addOption(lang.standardCode, lang.displayName);
        }
        drop.setValue(this.lang || "");
        drop.onChange(val => {
          this.lang = val;
        });
        return drop;
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

    // 读取记忆卡片下拉颜色
    const isEdit = this.existingCard && this.existingCard.sourceFile;
    if (!isEdit && this.plugin.settings.lastUsedCardColor) {
      this.color = this.plugin.settings.lastUsedCardColor;
    }

    // 卡片颜色下拉
    const colorSetting = new Setting(contentEl).setName(t("card_color_label"));
    const colors = [
      { value: "", label: t("color_default"), color: "var(--interactive-accent)" },
      { value: "red", label: t("color_red"), color: "var(--color-red)" },
      { value: "orange", label: t("color_orange"), color: "var(--color-orange)" },
      { value: "yellow", label: t("color_yellow"), color: "var(--color-yellow)" },
      { value: "green", label: t("color_green"), color: "var(--color-green)" },
      { value: "blue", label: t("color_blue"), color: "var(--color-blue)" },
      { value: "purple", label: t("color_purple"), color: "var(--color-purple)" },
        { value: "pink", label: t("color_pink"), color: "var(--color-pink)" },
      { value: "cyan", label: t("color_cyan"), color: "var(--color-cyan)" } 
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
    const colorMap = {
      red: "var(--color-red)",
      orange: "var(--color-orange)",
      yellow: "var(--color-yellow)",
      green: "var(--color-green)",
      blue: "var(--color-blue)",
      purple: "var(--color-purple)",
      pink: "var(--color-pink)",
      cyan: "var(--color-cyan)"
    };
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

  // ----- 追加例句到释义末尾（带章节标题） -----
  appendExample(text, customTitle = null) {
    if (!text) return;

    // 优先使用自定义标题，否则使用语言包默认标题
    const sectionTitle = customTitle && customTitle.trim() ? customTitle.trim() : t("example_section_title");
    const titlePattern = `**${sectionTitle}**`;

    let currentDef = this.definition || '';
    const parts = currentDef.split(/\n---\s*\n/);
    let foundIndex = -1;

    // 用 sectionTitle 匹配已存在的章节标题
    for (let i = 0; i < parts.length; i++) {
      const trimmed = parts[i].trim();
      if (!trimmed) continue;
      const match = trimmed.match(/^\*\*(.+?)\*\*\s*/);
      if (match && match[1].trim() === sectionTitle) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      // 已存在 → 在章节内容末尾追加
      let existingContent = parts[foundIndex];
      const lines = existingContent.split('\n');
      const titleLine = lines[0];
      let body = lines.slice(1).join('\n').trim();
      // 追加时在已有内容和新增内容之间加一个空行
      body = body ? body + '\n\n' + text : text;
      parts[foundIndex] = titleLine + '\n' + body;
      this.definition = parts.join('\n\n---\n\n');
    } else {
      // 不存在 → 新建章节
      const newSection = titlePattern + '\n' + text;
      this.definition = currentDef.trim()
        ? currentDef + '\n\n---\n' + newSection
        : newSection;
    }

    // 3. 刷新文本域
    if (this.defTextArea) {
      this.defTextArea.value = this.definition;
    }

    new Notice(t("example_appended", sectionTitle));
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
      phonetic: this.phonetic || "",
      lang: this.lang || "" 
    };
    try {
      await WordbookParser.saveCard(this.app, this.selectedFile, card, !this.existingCard);

      // 如果是新建单词，创建复习记录（等级0，明天复习）
      if (!this.existingCard || !this.existingCard.sourceFile) {
        const studyKey = getStudyKey(this.word, this.selectedFile);
        await this.plugin.studyStore.setReviewLevel(studyKey, 0);
      }

      const action = this.existingCard ? t("word_updated") : t("word_added");
      new Notice(t("word_saved", action));

      // 记忆卡片下拉颜色保存
      this.plugin.settings.lastUsedCardColor = this.color;
      await this.plugin.saveSettings();

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

// ========== 文档单词所在句子选择模态框（用于提取例句） ==========
class SentencePickerModal extends Modal {
  constructor(app, plugin, initialText, word, onConfirm, extractMode = 'paragraph', defaultSectionTitle = null) {
    super(app);
    this.plugin = plugin;
    this.initialText = initialText || '';
    this.word = word || '';
    this.onConfirm = onConfirm;
    this.extractMode = extractMode || 'paragraph';
    this.currentText = initialText || '';
    this.defaultSectionTitle = defaultSectionTitle || t("example_section_title");
  }

  // 转义正则特殊字符
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.titleEl.setText(t("example_picker_title"));

    // ---- 描述文字 ----
    const desc = contentEl.createEl('p', { text: t("example_picker_desc") });
    desc.style.cssText = 'color: var(--text-muted); font-size: 0.9em; margin-bottom: 12px;';

    // ---- 提取模式下拉选择器 ----
    let currentMode = this.extractMode || 'paragraph';

    const modeSetting = new Setting(contentEl)
      .setName(t("example_extract_mode"))
      .setDesc(t("example_extract_mode_desc"))
      .addDropdown(drop => {
        drop.addOption('paragraph', t("example_mode_paragraph"))
          .addOption('line', t("example_mode_line"))
          .addOption('sentence', t("example_mode_sentence"))
          .addOption('list', t("example_mode_list"))
          .setValue(currentMode)
          .onChange((val) => {
            currentMode = val;
            // 更新模式说明
            modeDescEl.textContent = descMap[val] || descMap['paragraph'];
            // 重新提取内容
            const newText = this.plugin.getSelectedSentence(val, this.word);
            if (newText) {
              this.currentText = newText;
              if (this.editDiv) {
                this.editDiv.innerHTML = this.highlightText(newText);
              }
            } else {
              if (this.editDiv) {
                this.editDiv.innerHTML = `<span style="color: var(--text-muted);">${t("example_no_content")}</span>`;
              }
            }
          });
        this.modeDropdown = drop;
        return drop;
      });

    // ---- 动态模式说明区 ----
    const descMap = {
      'paragraph': t("example_mode_paragraph_desc"),
      'line': t("example_mode_line_desc"),
      'sentence': t("example_mode_sentence_desc"),
      'list': t("example_mode_list_desc")
    };

    const modeDescEl = contentEl.createEl('p', {
      text: descMap[this.extractMode] || descMap['paragraph']
    });
    modeDescEl.style.cssText = `
      font-size: 0.85em;
      color: var(--text-muted);
      margin-bottom: 10px;
      padding: 6px 10px;
      background: var(--background-secondary);
      border-radius: 4px;
    `;

    // ---- 高亮函数（目标单词高亮显示） ----
    const highlightText = (text) => {
      if (!text) return text;
      let result = text;
      if (this.word && this.word.trim()) {
        const wordLower = this.word.trim().toLowerCase();
        const regex = new RegExp(`\\b(${this.escapeRegex(wordLower)})\\b`, 'gi');
        result = result.replace(regex, (match) => {
          return `<span style="color: var(--text-accent); font-weight: 500;">${match}</span>`;
        });
      }
      return result;
    };
    this.highlightText = highlightText;

    // ---- 清除高亮（只保留纯文本） ----
    const clearHighlight = () => {
      if (!this.editDiv) return;
      const plainText = this.editDiv.innerText;
      if (this.editDiv.innerHTML !== plainText) {
        this.editDiv.innerHTML = plainText;
      }
    };

    // ---- 刷新高亮 ----
    const refreshHighlight = () => {
      if (!this.editDiv) return;
      const plainText = this.editDiv.innerText;
      const newHtml = highlightText(plainText);
      if (this.editDiv.innerHTML !== newHtml) {
        this.editDiv.innerHTML = newHtml;
      }
    };

    // ---- 创建可编辑区域 ----
    const editDiv = contentEl.createEl('div', { cls: 'example-edit-area' });
    editDiv.setAttribute('contenteditable', 'true');
    editDiv.style.cssText = `
      width: 100%;
      min-height: 120px;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid var(--background-modifier-border);
      background: var(--background-primary);
      color: var(--text-normal);
      resize: vertical;
      overflow-y: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      outline: none;
      line-height: 1.6;
    `;

    // 初始渲染：显示高亮
    const initialText = this.initialText || '';
    editDiv.innerHTML = highlightText(initialText) || '';
    this.editDiv = editDiv;

    // ---- 聚焦/失焦事件 ----
    editDiv.addEventListener('focus', () => {
      clearHighlight();
    });

    editDiv.addEventListener('blur', () => {
      refreshHighlight();
    });

    // 监听用户编辑，更新 currentText
    editDiv.addEventListener('input', () => {
      this.currentText = editDiv.innerText;
    });

    // ---- 章节标题输入框 ----
    const sectionTitleSetting = new Setting(contentEl)
      .setName(t("example_section_title_label") || "Section Title")
      .addText(text => {
        text.setValue(this.defaultSectionTitle || t("example_section_title"));
        text.inputEl.placeholder = t("example_section_title");
        text.onChange(val => {
          this.customSectionTitle = val.trim() || null;
        });
        this.sectionTitleInput = text;
        return text;
      });

    // ---- 按钮 ----
    const buttonDiv = contentEl.createDiv({ cls: 'modal-button-container' });
    buttonDiv.style.cssText = 'display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;';

    const cancelBtn = buttonDiv.createEl('button', { text: t('cancel') });
    cancelBtn.addEventListener('click', () => this.close());

    const confirmBtn = buttonDiv.createEl('button', { text: t("example_picker_confirm"), cls: 'mod-cta' });
    confirmBtn.addEventListener('click', () => {
      refreshHighlight();
      const finalText = this.editDiv.innerText.trim();
      if (finalText) {
        const customTitle = this.sectionTitleInput ? this.sectionTitleInput.getValue().trim() : null;
        this.onConfirm(finalText, customTitle || null);
      }
      this.close();
    });

    // ---- 延迟执行使编辑区域失焦，以显示高亮 ----
    setTimeout(() => {
      if (editDiv) editDiv.blur();
    }, 10);
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

    this._verificationResult = null; // { status, message } 初始验证 API Key 结果缓存
    this._verificationCacheTime = 0;
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

    const tabTts = tabBar.createDiv({ cls: "wordbook-setting-tab" });
    setIcon(tabTts, "volume-2");
    tabTts.createSpan({ text: t("settings_tab_tts") });

    const tabAI = tabBar.createDiv({ cls: "wordbook-setting-tab" });
    setIcon(tabAI, "bot");
    tabAI.createSpan({ text: t("settings_tab_ai") });

    // 创建四个内容容器
    const filesContainer = containerEl.createDiv({ cls: "wordbook-setting-files-container" });
    const generalContainer = containerEl.createDiv({ cls: "wordbook-setting-general-container" });
    generalContainer.style.display = "none";
    const ttsContainer = containerEl.createDiv({ cls: "wordbook-setting-tts-container" });
    ttsContainer.style.display = "none";
    const aiContainer = containerEl.createDiv({ cls: "wordbook-setting-ai-container" });
    aiContainer.style.display = "none";

    // 填充内容
    this.buildFilesTab(filesContainer);
    this.buildGeneralTab(generalContainer);
    this.buildTtsTab(ttsContainer);
    this.buildAITab(aiContainer);

    // 切换逻辑
    const activateTab = (tabId) => {
      // 移除所有active类
      [tabFiles, tabGeneral, tabTts, tabAI].forEach(el => el.classList.remove('active'));
      // 隐藏所有容器
      filesContainer.style.display = "none";
      generalContainer.style.display = "none";
      ttsContainer.style.display = "none";
      aiContainer.style.display = "none";

      // 根据tabId显示对应的标签和容器
      if (tabId === 'files') {
        tabFiles.classList.add('active');
        filesContainer.style.display = "block";
      } else if (tabId === 'general') {
        tabGeneral.classList.add('active');
        generalContainer.style.display = "block";
      } else if (tabId === 'tts') {
        tabTts.classList.add('active');
        ttsContainer.style.display = "block";
      } else if (tabId === 'ai') {
        tabAI.classList.add('active');
        aiContainer.style.display = "block";
      }
      this.activeTabId = tabId;
    };

    // 绑定点击事件
    tabFiles.addEventListener("click", () => activateTab('files'));
    tabGeneral.addEventListener("click", () => activateTab('general'));
    tabTts.addEventListener("click", () => activateTab('tts'));
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
    buttonContainer.style.cssText = "display: flex; gap: 20px; margin-bottom: 4px; flex-wrap: wrap;";

    // 1. 新建单词本按钮
    const newBtn = buttonContainer.createEl("button", { text: t("settings_new_wordbook") });
    newBtn.addEventListener("click", () => this.showNewWordbookModal());

    // 2. 添加已有单词本按钮
    const addBtn = buttonContainer.createEl("button", { text: t("settings_add_wordbook") });
    addBtn.addEventListener("click", () => this.selectWordbookFile());

    // 3. 刷新按钮
    const refreshBtn = buttonContainer.createEl("button");
    setIcon(refreshBtn, "refresh-cw");
    refreshBtn.setAttribute("aria-label", t("refresh_wordbook"));
    refreshBtn.style.cursor = "pointer";
    refreshBtn.addEventListener("click", async () => {
      await this.plugin.reloadAllCards(true);
      await this.plugin.highlighter.refresh();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
      new Notice(t("wordbook_refreshed"));
      await this.updateWordCounts();
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
          .setDesc(t("file_not_found", file.path))
          .addButton(btn => btn.setIcon("folder-search").setTooltip(t("relocate_tooltip")).onClick(async () => {
            // 调用重新定位方法
            await this.relocateWordbookFile(file, idx);
          }))
          .addButton(btn => btn.setIcon("trash").setTooltip(t("remove_tooltip")).onClick(async () => {
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
        .setName(file.name)
        .setDesc(file.path)
        .addToggle(toggle => toggle.setValue(file.enabled).onChange(async (val) => {
          file.enabled = val;
          await this.plugin.saveSettings();
          await this.plugin.reloadAllCards();
          await this.plugin.highlighter.refresh();
          this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
        }))
        .addButton(btn => btn.setIcon("folder-search").setTooltip(t("relocate_tooltip")).onClick(async () => {
          await this.relocateWordbookFile(file, idx);
        }))
        .addButton(btn => btn.setIcon("trash").setTooltip(t("remove_tooltip")).onClick(async () => {
          this.plugin.settings.wordbookFiles.splice(idx, 1);
          delete this._wordCountCache[file.path];
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

            // 迁移掌握/忽略状态
            if (oldMode === "per-source" && val === "global") {
              await this.plugin.masteryStore.migrateFromPerSourceToGlobal();
              // 同时迁移复习记录
              await this.plugin.studyStore.migrateFromPerSourceToGlobal();
            } else if (oldMode === "global" && val === "per-source") {
              await this.plugin.masteryStore.migrateFromGlobalToPerSource();
              // 同时迁移复习记录
              await this.plugin.studyStore.migrateFromGlobalToPerSource();
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

    // ===== 导入模块 =====
    container.createEl("h3", { text: t("import_title") });

    // 掌握导入行
    const masteredSetting = new Setting(container)
      .setName(t("import_mastered"))
      .setDesc(t("import_mastered_desc"))
      .addButton(btn => {
        btn.setButtonText(t("import_button"))
          .setCta()
          .onClick(() => this.selectTxtFileForImport('mastered'));
        return btn;
      });

    // 忽略导入行
    const ignoredSetting = new Setting(container)
      .setName(t("import_ignored"))
      .setDesc(t("import_ignored_desc"))
      .addButton(btn => {
        btn.setButtonText(t("import_button"))
          .setCta()
          .onClick(() => this.selectTxtFileForImport('ignored'));
        return btn;
      });

    // ===== 导出区块 =====
    container.createEl("h3", { text: t("export_title") });

    // ===== 单词本导出 =====
    new Setting(container)
      .setName(t("export_name"))
      .setDesc(t("export_desc"))
      .addButton(btn => {
        btn.setButtonText(t("export_button"))
          .setCta()
          .onClick(() => {
            new ExportModal(this.app, this.plugin).open();
          });
        return btn;
      });

    // ===== 导出掌握/忽略 =====
    new Setting(container)
      .setName(t("export_mastered"))
      .setDesc(t("export_mastered_desc"))
      .addButton(btn => {
        btn.setButtonText(t("export_export"))
          .setCta()
          .onClick(() => {
            this.showExportWordsModal('mastered');
          });
        return btn;
      });

    new Setting(container)
      .setName(t("export_ignored"))
      .setDesc(t("export_ignored_desc"))
      .addButton(btn => {
        btn.setButtonText(t("export_export"))
          .setCta()
          .onClick(() => {
            this.showExportWordsModal('ignored');
          });
        return btn;
      });

    // ===== GitHub 链接 =====
    const githubContainer = container.createDiv({ cls: "wordbook-github-link" });
    githubContainer.style.cssText = "margin-top: 20px; padding-top: 12px; border-top: 1px solid var(--background-modifier-border); text-align: center; font-size: 0.85em; color: var(--text-muted);";
    githubContainer.innerHTML = t("github_link_text");

    // 为所有链接添加悬停效果
    githubContainer.querySelectorAll('.github-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.textDecoration = 'underline';
        link.style.color = 'var(--text-accent-hover)';
      });
      link.addEventListener('mouseleave', () => {
        link.style.textDecoration = 'none';
        link.style.color = 'var(--text-accent)';
      });
    });
  }

  buildGeneralTab(container) {
    // ===== 插件语言 =====
    container.createEl("h3", { text: t("plugin_language") });

    // ---- 插件语言选择 ----
    new Setting(container)
      .setName(t("plugin_language"))
      .setDesc(t("plugin_language_desc"))
      .addDropdown(async (drop) => {
        drop.addOption("auto", t("language_follow_obsidian"));
        drop.addOption("en", "English");
        drop.addOption("zh", "简体中文");
        drop.setValue(this.plugin.settings.pluginLanguage || "auto");
        drop.onChange(async (val) => {
          this.plugin.settings.pluginLanguage = val;
          await this.plugin.saveSettings();

          // 刷新所有视图内容
          const viewTypes = [
            VIEW_TYPE_SIDEBAR,
            VIEW_TYPE_LOOKUP,
            VIEW_TYPE_LIBRARY,
            VIEW_TYPE_STUDY
          ];
          for (const type of viewTypes) {
            const leaves = this.app.workspace.getLeavesOfType(type);
            for (const leaf of leaves) {
              const view = leaf.view;
              if (view && typeof view.refresh === 'function') {
                await view.refresh();
              }
            }
          }

          // 刷新设置面板自身
          this.display();
        });
      });

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
    // ---- 启用折叠释义 ----
    new Setting(container)
      .setName(t("settings_enable_fold"))
      .setDesc(t("settings_enable_fold_desc"))
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enableFoldDefinition)
        .onChange(async (val) => {
          this.plugin.settings.enableFoldDefinition = val;
          await this.plugin.saveSettings();

          // 触发数据更新事件，刷新侧边栏
          this.plugin.app.workspace.trigger("simple-wordbook:data-updated");

          // 手动刷新查词面板
          const lookupLeaves = this.plugin.app.workspace.getLeavesOfType(VIEW_TYPE_LOOKUP);
          for (const leaf of lookupLeaves) {
            const view = leaf.view;
            if (view && view.currentWord) {
              await view.doLocalLookup(view.currentWord);
            }
          }
        })
      );
    // ---- 启用/禁用 掌握/忽略 按钮 ----
    new Setting(container)
      .setName(t("settings_enable_mastery"))
      .setDesc(t("settings_enable_mastery_desc"))
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enableMastery)
        .onChange(async (val) => {
          this.plugin.settings.enableMastery = val;
          await this.plugin.saveSettings();

          // 触发数据更新事件，刷新侧边栏
          this.plugin.app.workspace.trigger("simple-wordbook:data-updated");

          // 手动刷新查词面板
          const lookupLeaves = this.plugin.app.workspace.getLeavesOfType(VIEW_TYPE_LOOKUP);
          for (const leaf of lookupLeaves) {
            const view = leaf.view;
            if (view && view.currentWord) {
              // 用当前单词重新执行本地查询，重建卡片
              await view.doLocalLookup(view.currentWord);
            }
          }
        })
      );


    // ===== 高亮样式 =====
    container.createEl("h3", { text: t("settings_highlight_styles") });

    const colorOptions = [
      { value: "none", label: t("color_none") },
      { value: "", label: t("color_default_desc") },
      { value: "#ff0000", label: t("color_red") },
      { value: "#ff7f00", label: t("color_orange") },
      { value: "#ffff00", label: t("color_yellow") },
      { value: "#00ff00", label: t("color_green") },
      { value: "#00bfff", label: t("color_blue") },
      { value: "#8a2be2", label: t("color_purple") },
      { value: "#ff69b4", label: t("color_pink") },
      { value: "#00ffff", label: t("color_cyan") },
      { value: "custom", label: t("color_custom") }
    ];

    // ---- 预先声明下划线预览元素和更新函数（占位） ----
    let underlinePreview = null;
    const updateUnderlinePreview = () => {
      if (!underlinePreview) return;
      const val = this.plugin.settings.underlineColor;
      const baseColor = this.plugin.settings.highlightColor;
      let color;
      if (val && val.trim()) {
        color = val;
      } else if (baseColor === "none") {
        color = "var(--interactive-accent)";
      } else {
        color = baseColor || "var(--interactive-accent)";
      }
      underlinePreview.style.backgroundColor = color;
      underlinePreview.style.backgroundImage = "none";
    };

    // ---- 高亮颜色设置 ----
    const mainColorSetting = new Setting(container)
      .setName(t("settings_highlight_color"))
      .setDesc(t("settings_highlight_color_desc"))
      .addDropdown(drop => {
        for (const opt of colorOptions) drop.addOption(opt.value, opt.label);
        // 获取当前高亮颜色
        const currentColor = this.plugin.settings.highlightColor || "";
        // 预设颜色值列表（包括 "none"、空字符串、色值等）
        const presetValues = colorOptions.map(opt => opt.value);
        // 如果当前颜色是预设值之一，则直接使用；否则视为自定义，下拉选 "custom"
        const initialValue = presetValues.includes(currentColor) ? currentColor : "custom";
        drop.setValue(initialValue);
        drop.onChange(async (val) => {
          if (val === "custom") {
            // 如果之前保存过自定义颜色，则使用它；否则保持当前高亮色
            if (this.plugin.settings.customHighlightColor) {
              this.plugin.settings.highlightColor = this.plugin.settings.customHighlightColor;
            } else {
              // 如果自定义颜色为空，则用当前高亮色作为初始自定义色
              this.plugin.settings.customHighlightColor = this.plugin.settings.highlightColor;
            }
            await this.plugin.saveSettings();
            await this.plugin.highlighter.refresh();
            updatePreview();
            updateUnderlinePreview();
          } else {
            this.plugin.settings.highlightColor = val;
            await this.plugin.saveSettings();
            await this.plugin.highlighter.refresh();
            updatePreview();
            updateUnderlinePreview();
          }
        });
        return drop;
      });

    // ---- 圆形按钮（取色器触发器） ----
    const colorPickerBtn = document.createElement("span");
    colorPickerBtn.style.cssText = `
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: 6px;
  border: 2px solid var(--background-modifier-border);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  background-color: var(--interactive-accent);
  position: relative;
`;
    colorPickerBtn.title = t("color_custom_picker_tooltip");

    // 内部取色器 input（覆盖按钮，点击即触发）
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.style.cssText = `
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  border: none;
  padding: 0;
  margin: 0;
  background: none;
`;
    colorPickerBtn.appendChild(colorInput);
    mainColorSetting.controlEl.appendChild(colorPickerBtn);

    // 监听取色器事件
    colorInput.addEventListener("input", (ev) => {
      const val = ev.target.value;
      this.plugin.settings.customHighlightColor = val;
      this.plugin.saveSettings();
      const drop = mainColorSetting.controlEl.querySelector("select");
      if (drop.value === "custom") {
        this.plugin.settings.highlightColor = val;
        this.plugin.highlighter.refresh();
      }
      updatePreview();
      updateUnderlinePreview();
    });

    colorInput.addEventListener("change", async (ev) => {
      const val = ev.target.value;
      this.plugin.settings.customHighlightColor = val;
      const drop = mainColorSetting.controlEl.querySelector("select");
      if (drop.value === "custom") {
        this.plugin.settings.highlightColor = val;
      }
      await this.plugin.saveSettings();
      if (drop.value === "custom") {
        await this.plugin.highlighter.refresh();
      }
      updatePreview();
      updateUnderlinePreview();
    });

    // ---- 高亮颜色预览块（方形） ----
    const previewSpan = document.createElement("span");
    previewSpan.style.cssText = "display:inline-block; width:20px; height:20px; border-radius:4px; margin-left:8px; border:1px solid var(--background-modifier-border);";
    mainColorSetting.controlEl.appendChild(previewSpan);

    // 预览更新函数（含自定义逻辑）
    const updatePreview = () => {
      const val = this.plugin.settings.highlightColor;
      const drop = mainColorSetting.controlEl.querySelector("select");
      const isCustom = drop && drop.value === "custom";

      // 方形预览块
      if (isCustom) {
        const color = (val && val !== "none") ? val : "var(--interactive-accent)";
        previewSpan.style.backgroundColor = color;
        previewSpan.style.backgroundImage = "none";
      } else {
        if (val === "none") {
          previewSpan.style.backgroundColor = "transparent";
          previewSpan.style.backgroundImage = "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)";
        } else {
          previewSpan.style.backgroundColor = val && val !== "" ? val : "var(--interactive-accent)";
          previewSpan.style.backgroundImage = "none";
        }
      }

      // 圆形按钮：显示自定义颜色
      const customColor = this.plugin.settings.customHighlightColor;
      if (customColor && customColor !== "none") {
        colorPickerBtn.style.backgroundColor = customColor;
        colorPickerBtn.style.border = "2px solid var(--background-modifier-border)";
      } else {
        colorPickerBtn.style.backgroundColor = "var(--interactive-accent)";
        colorPickerBtn.style.border = "2px dashed var(--text-muted)";
      }
      colorPickerBtn.style.opacity = "1";
      colorPickerBtn.style.pointerEvents = "auto";
    };

    // 初次渲染高亮预览
    updatePreview();

    // ---- Markdown 透明度 ----
    new Setting(container)
      .setName(t("settings_md_opacity"))
      .setDesc(t("settings_md_opacity_desc"))
      .addSlider(slider => {
        slider.setDynamicTooltip()
          .setLimits(0, 100, 5)
          .setValue(this.plugin.settings.mdHighlightOpacity)
          .onChange(async (value) => {
            this.plugin.settings.mdHighlightOpacity = value;
            await this.plugin.saveSettings();
            // 刷新所有高亮
            this.plugin.highlighter.refresh();
          });
        return slider;
      });

    // ---- PDF 透明度 ----
    new Setting(container)
      .setName(t("settings_pdf_opacity"))
      .setDesc(t("settings_pdf_opacity_desc"))
      .addSlider(slider => {
        slider.setDynamicTooltip()
          .setLimits(0, 100, 5)
          .setValue(this.plugin.settings.pdfHighlightOpacity)
          .onChange(async (value) => {
            this.plugin.settings.pdfHighlightOpacity = value;
            await this.plugin.saveSettings();
            // 仅刷新 PDF 高亮
            this.plugin.highlighter.applyToPDFs(0);
          });
        return slider;
      });

    // ---- 跟随卡片颜色 ----
    new Setting(container)
      .setName(t("settings_follow_card"))
      .setDesc(t("settings_follow_card_desc"))
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.followCardColor)
        .onChange(async (val) => {
          this.plugin.settings.followCardColor = val;
          await this.plugin.saveSettings();
          await this.plugin.highlighter.refresh();
        })
      );

    // ---- 文本颜色高亮 ----
    new Setting(container)
      .setName(t("settings_enable_text_highlight"))
      .setDesc(t("settings_enable_text_highlight_desc"))
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enableTextColorHighlight)
        .onChange(async (val) => {
          this.plugin.settings.enableTextColorHighlight = val;
          await this.plugin.saveSettings();
          await this.plugin.highlighter.refresh();
        })
      );

    // ---- 下划线样式 ----
    new Setting(container)
      .setName(t("settings_style_underline_type"))
      .addDropdown(drop => drop
        .addOption("none", t("settings_style_none"))
        .addOption("solid", t("settings_style_solid"))
        .addOption("dashed", t("settings_style_dashed"))
        .addOption("dotted", t("settings_style_dotted"))
        .addOption("wavy", t("settings_style_wavy"))
        .addOption("double", t("settings_style_double"))
        .setValue(this.plugin.settings.highlightStyles.underlineType)
        .onChange(async (val) => {
          this.plugin.settings.highlightStyles.underlineType = val;
          await this.plugin.saveSettings();
          await this.plugin.highlighter.refresh();
        })
      );

    // ---- 下划线颜色 ----
    const underlineColorSetting = new Setting(container)
      .setName(t("settings_underline_color"))
      .setDesc(t("settings_underline_color_desc"))
      .addDropdown(drop => {
        drop.addOption("", t("underline_color_default"));
        for (const opt of colorOptions) {
          if (opt.value !== "" && opt.value !== "none" && opt.value !== "custom") {
            drop.addOption(opt.value, opt.label);
          }
        }
        drop.setValue(this.plugin.settings.underlineColor || "");
        drop.onChange(async (val) => {
          this.plugin.settings.underlineColor = val;
          await this.plugin.saveSettings();
          await this.plugin.highlighter.refresh();
          updateUnderlinePreview();
        });
        return drop;
      });

    // 下划线预览元素（实际创建）
    underlinePreview = document.createElement("span");
    underlinePreview.style.cssText = "display:inline-block; width:20px; height:20px; border-radius:4px; margin-left:8px; border:1px solid var(--background-modifier-border);";
    underlineColorSetting.controlEl.appendChild(underlinePreview);
    // 初次渲染下划线预览
    updateUnderlinePreview();

    // ---- 粗体 ----
    new Setting(container)
      .setName(t("settings_style_bold"))
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.highlightStyles.bold)
        .onChange(async (val) => {
          this.plugin.settings.highlightStyles.bold = val;
          await this.plugin.saveSettings();
          await this.plugin.highlighter.refresh();
        })
      );

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
    new Setting(container).setName(t("settings_scope_mode")).setDesc(t("settings_scope_mode_desc")).addDropdown(drop => drop.addOption("include", t("settings_scope_mode_include")).addOption("exclude", t("settings_scope_mode_exclude")).setValue(this.plugin.settings.scopeMode).onChange(async (val) => {
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

  buildTtsTab(container) {
    const plugin = this.plugin;
    const settings = plugin.settings;

    // ===== 通用发音设置 =====
    container.createEl("h3", { text: t("tts_pronunciation_general") });

    // ===== 默认发音语言 =====
    const langContainer = container.createDiv({ cls: 'default-lang-container' });
    langContainer.style.cssText = 'margin-top: 4px;';

    // ===== 当前语言详情框 =====
    const detailContainer = container.createDiv({ cls: 'language-detail-container' });
    detailContainer.style.cssText = 'margin-top: 8px; margin-bottom: 8px;';

    const detailBox = detailContainer.createDiv({ cls: 'language-detail-box' });
    detailBox.style.cssText = 'border: 1px solid var(--background-modifier-border); border-radius: 4px; padding: 12px; background: var(--background-secondary);';

    // 标题行
    const headerRow = detailBox.createDiv({ cls: 'language-detail-header' });
    headerRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;';
    const titleEl = headerRow.createSpan({ text: t('language_current_detail') });
    titleEl.style.cssText = 'font-weight: bold; font-size: 0.9em;';

    const btnGroup = headerRow.createDiv({ cls: 'language-detail-buttons' });
    btnGroup.style.cssText = 'display: flex; gap: 4px;';

    const editBtn = btnGroup.createEl('button', { cls: 'clickable-icon' });
    setIcon(editBtn, 'pencil');
    editBtn.style.cssText = 'padding: 0 4px;';
    editBtn.setAttribute('aria-label', t('edit'));

    const deleteBtn = btnGroup.createEl('button', { cls: 'clickable-icon' });
    setIcon(deleteBtn, 'trash');
    deleteBtn.style.cssText = 'padding: 0 4px;';
    deleteBtn.setAttribute('aria-label', t('delete'));

    // 内容行
    const contentRow = detailBox.createDiv({ cls: 'language-detail-content' });
    contentRow.style.cssText = 'font-size: 0.85em; line-height: 1.6;';

    // 定义更新函数
    const updateLanguageDetail = () => {
      const defaultCode = settings.defaultLanguage || 'en';
      const lang = settings.languages.find(l => l.standardCode === defaultCode) || settings.languages.find(l => l.standardCode === 'en');
      if (!lang) return;
      contentRow.empty();
      contentRow.createDiv({ text: `${t('language_display_name')}: ${lang.displayName}` });
      contentRow.createDiv({ text: `${t('language_standard_code')}: ${lang.standardCode}` });
      const presetText = `${t('preset_google')}: ${lang.presetCodes.google || lang.standardCode}  ·  ${t('preset_baidu')}: ${lang.presetCodes.baidu || lang.standardCode}  ·  ${t('preset_system')}: ${lang.presetCodes.system || lang.standardCode}  ·  ${t('preset_custom')}: ${lang.presetCodes.custom || lang.standardCode}`;
      contentRow.createDiv({ text: presetText });
    };

    // 编辑按钮
    editBtn.addEventListener('click', () => {
      const defaultCode = settings.defaultLanguage || 'en';
      const lang = settings.languages.find(l => l.standardCode === defaultCode) || settings.languages.find(l => l.standardCode === 'en');
      if (lang) {
        new LanguageModal(plugin.app, plugin, lang, () => {
          updateLanguageDetail();
          this.display();
        }).open();
      }
    });

    // 删除按钮
    deleteBtn.addEventListener('click', async () => {
      const defaultCode = settings.defaultLanguage || 'en';
      const lang = settings.languages.find(l => l.standardCode === defaultCode) || settings.languages.find(l => l.standardCode === 'en');
      if (!lang) return;

      // 禁止删除 en
      if (lang.standardCode === 'en') {
        new Notice(t('language_cannot_delete_en'));
        return;
      }

      const allCards = plugin.getAllCards();
      const count = allCards.filter(c => c.lang === lang.standardCode).length;
      const confirmMsg = count > 0 ? t('language_delete_confirm_with_count', count) : t('language_delete_confirm');
      const confirmed = await new Promise((resolve) => {
        const modal = new ConfirmModal(plugin.app, () => resolve(true), () => resolve(false), confirmMsg);
        modal.open();
      });
      if (!confirmed) return;
      const idx = settings.languages.findIndex(l => l.standardCode === lang.standardCode);
      if (idx !== -1) {
        settings.languages.splice(idx, 1);
        await plugin.saveSettings();
        if (settings.defaultLanguage === lang.standardCode) {
          settings.defaultLanguage = 'en';
          await plugin.saveSettings();
        }
        updateLanguageDetail();
        new Notice(t('language_deleted'));
        this.display();
      }
    });

    // 下拉选择默认发音语言
    new Setting(langContainer)
      .setName(t("tts_default_lang_label"))
      .setDesc(t("tts_default_lang_desc"))
      .addDropdown(drop => {
        // 从语言列表动态生成下拉选项
        const languages = settings.languages || [];
        for (const lang of languages) {
          drop.addOption(lang.standardCode, lang.displayName);
        }
        drop.setValue(settings.defaultLanguage || 'en');
        drop.onChange(async (val) => {
          settings.defaultLanguage = val;
          await plugin.saveSettings();
          // 刷新当前语言详情框
          updateLanguageDetail();
        });
        return drop;
      });

    // 新增语言按钮
    const addButtonContainer = container.createDiv({ cls: 'language-add-button' });
    addButtonContainer.style.cssText = 'margin-top: 8px; margin-bottom: 20px;';
    const addBtn = addButtonContainer.createEl('button', { text: t('language_add') });
    addBtn.addEventListener('click', () => {
      new LanguageModal(plugin.app, plugin, null, () => {
        updateLanguageDetail();
        this.display();
      }).open();
    });

    // 初次填充详情框
    updateLanguageDetail();

    // ===== 发音设置标题 =====
    container.createEl("h3", { text: t("tts_network_tts_title") });

    // ===== 预设模板下拉 =====
    const presetSetting = new Setting(container)
      .setName(t("tts_preset_label"))
      .setDesc(t("tts_preset_desc")) 
      .addDropdown(drop => {
        drop.addOption('youdao', t("tts_preset_youdao"));
        drop.addOption('baidu', t("tts_preset_baidu"));
        drop.addOption('google', t("tts_preset_google"));
        drop.addOption('custom', t("tts_preset_custom"));

        // 保存引用
        this.presetDropdown = drop;

        // 读取保存的预设
        const currentPreset = settings.ttsPreset || 'custom';
        drop.setValue(currentPreset);

        drop.onChange(async (val) => {
          settings.ttsPreset = val;
          let url;

          if (val === 'custom') {
            // 自定义：使用保存的自定义模板，若为空则回退到默认
            url = settings.customTtsUrlTemplate || settings.ttsUrlTemplate || DEFAULT_SETTINGS.ttsUrlTemplate;
            settings.ttsUrlTemplate = url;
          } else {
            // 预设模板
            if (val === 'youdao') {
              url = 'https://dict.youdao.com/dictvoice?audio={{word}}&type={{type}}';
            } else if (val === 'baidu') {
              url = 'https://fanyi.baidu.com/gettts?lan={{lang}}&text={{word}}&spd={{rate}}&source=web';
            } else if (val === 'google') {
              url = 'https://translate.google.com/translate_tts?ie=UTF-8&q={{word}}&tl={{lang}}&client=tw-ob&ttsspeed={{rate}}';
            } else {
              // 自定义：保留当前值
              url = settings.ttsUrlTemplate;
            }
            settings.ttsUrlTemplate = url;
          }

          // 更新模板输入框
          if (this.ttsTemplateInput) {
            this.ttsTemplateInput.setValue(settings.ttsUrlTemplate);
          }

          settings.ttsUrlTemplate = url;
          await plugin.saveSettings();

          // 加载对应预设的语速配置
          if (this.loadRateConfig) {
            this.loadRateConfig();
          }

          // 切换预设后更新控件的显隐
          this.toggleTtsControls(val);
        });

        return drop;
      });

    // ===== TTS URL 模板输入框 =====
    const templateSetting = new Setting(container)
      .setName(t("settings_tts_template"))
      .setDesc(t("tts_template_desc"))
      .addTextArea(text => {
        text.setValue(settings.ttsUrlTemplate);
        text.onChange(async (val) => {
          // 保存自定义模板
          settings.customTtsUrlTemplate = val;

          // 用户修改，如果当前预设不是 custom，自动切换
          if (settings.ttsPreset !== 'custom') {
            settings.ttsPreset = 'custom';
            if (this.presetDropdown) {
              // 手动更新下拉框选中状态，但不触发 onChange
              const select = this.presetDropdown.selectEl;
              select.value = 'custom';
              // 刷新 UI 显隐和语速配置
              this.toggleTtsControls('custom');
              if (this.loadRateConfig) {
                this.loadRateConfig();
              }
            }
          }

          // 更新当前模板
          settings.ttsUrlTemplate = val;

          await plugin.saveSettings();
        });
        // 设置行数和宽度
        text.inputEl.rows = 1;
        text.inputEl.style.width = "100%";
        text.inputEl.style.resize = "vertical";
        text.inputEl.style.minHeight = "32px";
        // 保存引用，供预设切换时更新
        this.ttsTemplateInput = text;
        return text;
      });

    // ===== 发音偏好（US/UK），仅当预设为“有道”或“自定义”时显示 =====
    const variantContainer = container.createDiv({ cls: 'pronunciation-variant-container' });
    variantContainer.style.cssText = 'margin-top: 4px;';

    new Setting(variantContainer)
      .setName(t("settings_variant"))
      .setDesc(t("tts_variant_desc"))
      .addDropdown(drop => {
        drop.addOption('us', 'US')
          .addOption('uk', 'UK')
          .setValue(settings.pronunciationVariant || 'us')
          .onChange(async (val) => {
            settings.pronunciationVariant = val;
            await plugin.saveSettings();
          });
        return drop;
      });

    // ===== 语速控制 =====
    const rateContainer = container.createDiv({ cls: 'speech-rate-container' });
    rateContainer.style.cssText = 'margin-top: 8px;';

    const rateSetting = new Setting(rateContainer)
      .setName(t("tts_speech_rate_label"))
      .setDesc(t("tts_speech_rate_desc"))
      .addButton(btn => {
        btn.setButtonText(t("tts_speech_rate_reset"))
          .setTooltip(t("tts_speech_rate_reset_tooltip"))
          .onClick(() => {
            const preset = settings.ttsPreset || 'custom';
            const defaultConfig = DEFAULT_SETTINGS.speechRatePresets?.[preset];
            if (defaultConfig) {
              // 更新 UI
              minInput.value = String(defaultConfig.min);
              maxInput.value = String(defaultConfig.max);
              slider.min = String(defaultConfig.min);
              slider.max = String(defaultConfig.max);
              slider.value = String(defaultConfig.value);
              valueDisplay.textContent = t("tts_speech_rate_current", defaultConfig.value);

              // 更新 settings
              if (!settings.speechRatePresets) settings.speechRatePresets = {};
              settings.speechRatePresets[preset] = { ...defaultConfig };
              plugin.saveSettings();
            }
          });
        return btn;
      });

    // ---- 调速控件 ----
    // 最小/最大值输入行
    const rangeRow = rateContainer.createDiv({ cls: 'speech-rate-range-row' });
    rangeRow.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-bottom: 4px; flex-wrap: wrap;';

    // 最小值
    const minLabel = rangeRow.createSpan({ text: t("tts_speech_rate_min") });
    minLabel.style.cssText = 'font-size: 0.85em; color: var(--text-muted);';
    const minInput = rangeRow.createEl('input', { type: 'number' });
    minInput.style.cssText = 'width: 70px; padding: 4px 6px; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal);';
    minInput.step = '0.1';

    // 滑动条
    const slider = rangeRow.createEl('input', { type: 'range' });
    slider.style.cssText = 'flex: 1; min-width: 100px;';
    slider.step = '0.1';

    // 最大值
    const maxLabel = rangeRow.createSpan({ text: t("tts_speech_rate_max") });
    maxLabel.style.cssText = 'font-size: 0.85em; color: var(--text-muted);';
    const maxInput = rangeRow.createEl('input', { type: 'number' });
    maxInput.style.cssText = 'width: 70px; padding: 4px 6px; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal);';
    maxInput.step = '0.1';

    // 当前值显示
    const valueDisplay = rateContainer.createDiv({ cls: 'speech-rate-value-display' });
    valueDisplay.style.cssText = 'text-align: center; font-size: 0.9em; color: var(--text-muted); padding: 4px 0;';

    // ---- 加载当前预设的语速配置 ----
    const loadRateConfig = () => {
      const preset = settings.ttsPreset || 'custom';
      const config = settings.speechRatePresets?.[preset] || { min: 0.5, max: 2.0, value: 1.0 };
      minInput.value = String(config.min);
      maxInput.value = String(config.max);
      slider.min = String(config.min);
      slider.max = String(config.max);
      slider.value = String(config.value);
      valueDisplay.textContent = t("tts_speech_rate_current", config.value);
    };
    loadRateConfig();

    // ---- 保存当前语速配置 ----
    const saveRateConfig = () => {
      const preset = settings.ttsPreset || 'custom';
      if (!settings.speechRatePresets) settings.speechRatePresets = {};
      if (!settings.speechRatePresets[preset]) {
        settings.speechRatePresets[preset] = { min: 0.5, max: 2.0, value: 1.0 };
      }
      const config = settings.speechRatePresets[preset];
      config.min = parseFloat(minInput.value) || 0.5;
      config.max = parseFloat(maxInput.value) || 2.0;
      config.value = parseFloat(slider.value) || 1.0;
      // 确保 min < max
      if (config.min >= config.max) {
        config.max = config.min + 0.5;
        maxInput.value = String(config.max);
      }
      // 如果当前值超出范围，修正
      if (config.value < config.min) config.value = config.min;
      if (config.value > config.max) config.value = config.max;
      slider.value = String(config.value);
      // 同步更新滑块的 min/max 属性
      slider.min = String(config.min);
      slider.max = String(config.max);
      valueDisplay.textContent = t("tts_speech_rate_current", config.value);
      plugin.saveSettings();
    };

    // ---- 事件绑定 ----
    minInput.addEventListener('change', saveRateConfig);
    maxInput.addEventListener('change', saveRateConfig);
    slider.addEventListener('input', () => {
      const val = parseFloat(slider.value) || 1.0;
      const preset = settings.ttsPreset || 'custom';
      if (settings.speechRatePresets && settings.speechRatePresets[preset]) {
        settings.speechRatePresets[preset].value = val;
        valueDisplay.textContent = t("tts_speech_rate_current", val);
        plugin.saveSettings();
      }
    });

    // 保存引用供切换预设时更新
    this.rateContainer = rateContainer;
    this.rateMinInput = minInput;
    this.rateMaxInput = maxInput;
    this.rateSlider = slider;
    this.rateValueDisplay = valueDisplay;
    this.loadRateConfig = loadRateConfig; // 供预设切换调用

    // 保存引用，供显隐控制使用
    this.variantContainer = variantContainer;

    // ===== 网络TTS 发音测试 =====
    const testContainer = container.createDiv({ cls: 'tts-test-container' });
    testContainer.style.cssText = 'margin-top: 12px; padding-top: 8px;';

    let testWordInput = null;

    new Setting(testContainer)
      .setName(t("tts_test_label"))
      .setDesc(t("tts_test_desc"))
      .addText(text => {
        text.setValue('hello');
        text.inputEl.placeholder = 'e.g. hello';
        testWordInput = text;
        return text;
      })
      .addButton(btn => {
        btn.setButtonText(t("tts_test_play"))
          .setCta()
          .onClick(async () => {
            const word = testWordInput ? testWordInput.getValue().trim() : 'hello';
            if (!word) {
              new Notice(t("tts_test_enter_word"));
              return;
            }
            // 临时禁用系统TTS，强制使用网络TTS
            const oldEnable = settings.enableSystemTTS;
            settings.enableSystemTTS = false;
            try {
              await playPronunciation(
                word,
                settings.ttsUrlTemplate,
                settings.pronunciationVariant,
                settings.defaultLanguage
              );
            } catch (e) {
              // playPronunciation 内部已有错误处理，但以防万一
              console.warn('TTS test failed:', e);
            } finally {
              settings.enableSystemTTS = oldEnable;
            }
          });
        return btn;
      });

    // ===== 系统 TTS =====
    container.createEl("h3", { text: t("tts_system_tts_title") });

    // 启用开关
    new Setting(container)
      .setName(t("tts_system_tts_enable"))
      .setDesc(t("tts_system_tts_desc"))
      .addToggle(toggle => toggle
        .setValue(settings.enableSystemTTS || false)
        .onChange(async (val) => {
          settings.enableSystemTTS = val;
          await plugin.saveSettings();
        })
      );

    // ---- 语音选择 ----
    const voiceSetting = new Setting(container)
      .setName(t("tts_system_voice_label"))
      .setDesc(t("tts_system_voice_desc"));

    const voiceControlRow = voiceSetting.controlEl.createDiv({ cls: 'system-voice-row' });
    voiceControlRow.style.cssText = 'display: flex; align-items: center; gap: 8px; flex-wrap: wrap;';

    const voiceDropdown = voiceControlRow.createEl('select');
    voiceDropdown.style.cssText = 'flex: 1; min-width: 150px;';

    // 试听按钮
    const testBtn = voiceControlRow.createEl('button', { text: t("tts_system_voice_test") });
    testBtn.style.cssText = 'flex-shrink: 0;';

    // 加载状态与无语音提示（共享同一个元素）
    const statusMsg = voiceControlRow.createSpan();
    statusMsg.style.cssText = 'color: var(--text-muted); font-size: 0.9em; display: none;';

    // 检查 speechSynthesis 是否可用
    const isSpeechSupported = typeof window.speechSynthesis !== 'undefined' && window.speechSynthesis;

    // 填充语音列表的函数
    const populateVoices = () => {
      // 添加安全检查
      if (!isSpeechSupported) {
        voiceDropdown.style.display = 'none';
        testBtn.style.display = 'none';
        statusMsg.style.display = 'inline';
        statusMsg.textContent = t("tts_system_voice_no_voices");
        return;
      }

      try {
        const voices = window.speechSynthesis.getVoices();
        voiceDropdown.innerHTML = '';
        if (!voices || voices.length === 0) {
          voiceDropdown.style.display = 'none';
          testBtn.style.display = 'none';
          statusMsg.style.display = 'inline';
          statusMsg.textContent = t("tts_system_voice_no_voices");
          return;
        }
        voiceDropdown.style.display = 'inline-block';
        testBtn.style.display = 'inline-block';
        statusMsg.style.display = 'none';

        // 添加"默认"选项
        const defaultOption = voiceDropdown.createEl('option', {
          value: 'default',
          text: t("tts_system_voice_default")
        });
        if (!settings.systemTTSVoiceName || settings.systemTTSVoiceName === 'default') {
          defaultOption.selected = true;
        }

        // 按语言分组排序
        const sorted = voices.sort((a, b) => a.lang.localeCompare(b.lang));
        for (const voice of sorted) {
          const option = voiceDropdown.createEl('option', {
            value: voice.name || voice.voiceURI,
            text: `${voice.name} (${voice.lang})`
          });
          if (settings.systemTTSVoiceName && settings.systemTTSVoiceName !== 'default' &&
            (voice.name === settings.systemTTSVoiceName || voice.voiceURI === settings.systemTTSVoiceName)) {
            option.selected = true;
          }
        }
      } catch (e) {
        console.warn('Failed to get system voices:', e);
        voiceDropdown.style.display = 'none';
        testBtn.style.display = 'none';
        statusMsg.style.display = 'inline';
        statusMsg.textContent = t("tts_system_voice_no_voices");
      }
    };

    // 显示加载状态
    voiceDropdown.style.display = 'none';
    testBtn.style.display = 'none';
    statusMsg.style.display = 'inline';
    statusMsg.textContent = t("tts_system_voice_loading");

    // 首次填充（可能异步）
    if (!isSpeechSupported) {
      // 不支持：直接显示无语音
      voiceDropdown.style.display = 'none';
      testBtn.style.display = 'none';
      statusMsg.style.display = 'inline';
      statusMsg.textContent = t("tts_system_voice_no_voices");
    } else {
      // 支持：正常填充
      const initialVoices = window.speechSynthesis.getVoices();
      if (initialVoices && initialVoices.length > 0) {
        populateVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          try {
            populateVoices();
            // 若当前无存储值，默认选择"default"
            if (!settings.systemTTSVoiceName) {
              settings.systemTTSVoiceName = 'default';
              plugin.saveSettings();
            }
          } catch (e) {
            console.warn('Error on voices changed:', e);
          }
        };
      }
    }

    // 下拉框变化时保存
    voiceDropdown.addEventListener('change', () => {
      settings.systemTTSVoiceName = voiceDropdown.value;
      plugin.saveSettings();
    });

    // 试听按钮
    let isPlaying = false;
    testBtn.addEventListener('click', () => {
      if (isPlaying) return;
      if (!window.speechSynthesis) {
        new Notice(t("tts_system_voice_no_voices"));
        return;
      }
      try {
        const testText = t("tts_system_test_text");
        const utterance = new SpeechSynthesisUtterance(testText);
        // 应用当前系统 TTS 参数
        utterance.rate = settings.systemTTSSpeechRate ?? 1.0;
        utterance.pitch = settings.systemTTSPitch ?? 1.0;
        const voiceName = settings.systemTTSVoiceName || 'default';
        if (voiceName !== 'default') {
          const voices = window.speechSynthesis.getVoices();
          const matched = voices.find(v => v.name === voiceName || v.voiceURI === voiceName);
          if (matched) utterance.voice = matched;
        }
        isPlaying = true;
        testBtn.textContent = t("tts_system_voice_test") + '...';
        testBtn.disabled = true;
        utterance.onend = () => {
          isPlaying = false;
          testBtn.textContent = t("tts_system_voice_test");
          testBtn.disabled = false;
        };
        utterance.onerror = () => {
          isPlaying = false;
          testBtn.textContent = t("tts_system_voice_test");
          testBtn.disabled = false;
        };
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Test voice playback failed:', e);
        new Notice(t("tts_system_voice_no_voices"));
        isPlaying = false;
        testBtn.textContent = t("tts_system_voice_test");
        testBtn.disabled = false;
      }
    });

    // ---- 语速（系统 TTS 专用） ----
    new Setting(container)
      .setName(t("tts_system_rate_label"))
      .setDesc(t("tts_system_rate_desc"))
      .addSlider(slider => {
        const rate = Number(settings.systemTTSSpeechRate) || 1.0;
        slider.setDynamicTooltip()
          .setLimits(0.5, 2.0, 0.1)
          .setValue(rate)
          .onChange(async (value) => {
            settings.systemTTSSpeechRate = value;
            await plugin.saveSettings();
          });
        return slider;
      });

    // ---- 音高 ----
    new Setting(container)
      .setName(t("tts_system_pitch_label"))
      .setDesc(t("tts_system_pitch_desc"))
      .addSlider(slider => {
        const pitch = Number(settings.systemTTSPitch) || 1.0;
        slider.setDynamicTooltip()
          .setLimits(0.5, 2.0, 0.1)
          .setValue(pitch)
          .onChange(async (value) => {
            settings.systemTTSPitch = value;
            await plugin.saveSettings();
          });
        return slider;
      });

    // ---- 提示信息 ----
    const hintDiv = container.createDiv({ cls: 'system-tts-hint' });
    hintDiv.style.cssText = 'margin-top: 8px; font-size: 0.85em; color: var(--text-muted); padding-left: 15px;';
    hintDiv.textContent = t("tts_system_hint");

    // ----- 初始化显隐状态（根据预设控制网络 TTS 控件的显隐） -----
    const initialPreset = settings.ttsPreset || 'custom';
    this.toggleTtsControls(initialPreset);
  }

  // ----- 辅助方法：切换 TTS 控件的显隐 -----
  toggleTtsControls(preset) {
    // 控制“发音偏好”（US/UK）：有道或自定义时显示
    if (this.variantContainer) {
      if (preset === 'youdao' || preset === 'custom') {
        this.variantContainer.style.display = 'block';
      } else {
        this.variantContainer.style.display = 'none';
      }
    }

    // 控制“语速”：有道时隐藏，其他情况显示
    if (this.rateContainer) {
      this.rateContainer.style.display = (preset === 'youdao') ? 'none' : 'block';
    }
  }

  buildAITab(container) {
    const plugin = this.plugin;
    const settings = plugin.settings;

    container.createEl("h3", { text: t("settings_api_config") });

    // 使用插件启动时保存的检测结果(检测SecretStorage 是否可用)
    const hasSecretStorage = plugin._hasSecretStorage === true;

    // 服务商映射
    const providerMap = {
      openai: { url: "https://api.openai.com/v1/chat/completions", model: "gpt-3.5-turbo" },
      deepseek: { url: "https://api.deepseek.com/v1/chat/completions", model: "deepseek-chat" },
      glm: { url: "https://open.bigmodel.cn/api/paas/v4/chat/completions", model: "glm-4" },
      tongyi: { url: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", model: "qwen-turbo" },
      ollama: { url: "http://localhost:11434/api/chat", model: "llama2" },
      custom: { url: "", model: "" }
    };

    // ---- 服务提供商 ----
    new Setting(container)
      .setName(t("settings_ai_provider"))
      .setDesc(t("settings_ai_provider_desc"))
      .addDropdown(drop => {
        const options = {
          openai: t("provider_openai"),
          deepseek: t("provider_deepseek"),
          glm: t("provider_glm"),
          tongyi: t("provider_tongyi"),
          ollama: t("provider_ollama"),
          custom: t("provider_custom")
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

    // ---- API 地址 ----
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

    // ====== API 密钥 存储模式 + 密钥控件 ======

    // ---- 存储模式下拉框 ----
    const modeSetting = new Setting(container)
      .setName(t("settings_api_key_mode"))
      .addDropdown(drop => {
        if (!hasSecretStorage) {
          // 环境不支持：只显示本地加密，禁用下拉框
          drop.addOption("local_encrypted", t("settings_api_key_mode_local"));
          drop.setValue("local_encrypted");
          drop.selectEl.disabled = true;
        } else {
          // 环境支持：正常显示两个选项
          drop.addOption("secret_storage", t("settings_api_key_mode_secret"))
            .addOption("local_encrypted", t("settings_api_key_mode_local"))
            .setValue(settings.api?.mode === "local_encrypted" ? "local_encrypted" : "secret_storage")
            .onChange(async (val) => {
              await this.switchMode(val, true);
            });
        }
        return drop;
      });

    // ---- API 密钥控件 ----
    const keySetting = new Setting(container)
      .setName(t("settings_ai_api_key"));

    const controlContainer = document.createElement("div");
    controlContainer.style.cssText = "display: flex; align-items: center; gap: 8px; flex-wrap: wrap; width: 100%;";
    keySetting.controlEl.appendChild(controlContainer);

    // ---- 本地加密：密码输入框 ----
    let textInputContainer = document.createElement("div");
    textInputContainer.style.cssText = "flex: 1; min-width: 150px; display: flex;";
    controlContainer.appendChild(textInputContainer);

    let textInput = document.createElement("input");
    textInput.type = "password";
    textInput.style.cssText = "width: 100%; padding: 4px 8px; border-radius: 4px; border: 1px solid var(--background-modifier-border);";

    const api = settings.api || { mode: "secret_storage" };
    if (api.mode === "local_encrypted" && api.encryptedData?.ciphertext) {
      textInput.placeholder = "🔒 " + t("settings_api_key_status_encrypted");
    } else if (api.mode === "local_encrypted") {
      textInput.placeholder = t("api_key_placeholder");
    } else {
      textInput.placeholder = t("api_key_placeholder");
    }
    textInputContainer.appendChild(textInput);

    // 本地加密：失焦保存
    textInput.addEventListener("change", async () => {
      const val = textInput.value.trim();
      if (!val) return;

      const salt = generateSalt();
      const ciphertext = await encryptApiKey(plugin.app, val, salt);

      if (!settings.api) settings.api = { mode: "local_encrypted", secretName: "", encryptedData: null };
      settings.api.mode = "local_encrypted";
      settings.api.encryptedData = { ciphertext, salt };
      settings.api.secretName = "";

      await plugin.saveSettings();
      setTimeout(() => this.triggerVerification(true), 100); //本地加密输入框保存后触发验证
      textInput.value = "";
      textInput.placeholder = "🔒 " + t("settings_api_key_status_encrypted");
      this.updateApiStatus();
      new Notice(t("notice_api_saved_encrypted"));
      this._skipCount = true;
      this.display();
    });

    // ---- 官方密钥链：SecretComponent ----
    let secretComponentContainer = document.createElement("div");
    secretComponentContainer.style.cssText = "flex: 1; min-width: 150px; display: flex; align-items: center;";
    controlContainer.appendChild(secretComponentContainer);

    let secretComponent = null;

    const refreshSecretComponent = () => {
      if (secretComponentContainer) {
        secretComponentContainer.empty();
        secretComponent = new SecretComponent(plugin.app, secretComponentContainer);
        const currentName = settings.api?.secretName || "";
        secretComponent
          .setValue(currentName)
          .onChange(async (val) => {
            if (!settings.api) settings.api = { mode: "secret_storage", secretName: "", encryptedData: null };
            settings.api.secretName = val;
            settings.api.mode = "secret_storage";
            settings.api.encryptedData = null;
            await plugin.saveSettings();
            // 选择密钥后重新验证
            setTimeout(() => this.triggerVerification(true), 100);
          });
      }
    };

    // ---- 状态标签 ----
    let statusSpan = document.createElement("span");
    statusSpan.style.cssText = "font-size: 0.8em; color: var(--text-muted); white-space: normal; flex-shrink: 0; max-width: 100%;";
    controlContainer.appendChild(statusSpan);

    // ---- 更新状态标签 ----
    const updateApiStatus = () => {
      const api = settings.api || { mode: "secret_storage" };

      // 优先显示验证结果
      if (this._verificationResult) {
        const result = this._verificationResult;
        statusSpan.textContent = result.message;
        if (result.status === "valid") {
          statusSpan.style.color = "var(--color-green)";
        } else if (result.status === "verifying") {
          statusSpan.style.color = "var(--text-muted)";
        } else if (result.status === "empty") {
          statusSpan.style.color = "var(--color-orange)";
        } else {
          statusSpan.style.color = "var(--color-red)";
        }
        return;
      }

      // 降级：无验证结果时显示基础状态
      if (api.mode === "secret_storage") {
        const name = api.secretName;
        if (name) {
          statusSpan.textContent = t("settings_api_key_status_associated", name);
          statusSpan.style.color = "var(--color-green)";
        } else {
          statusSpan.textContent = t("settings_api_key_status_not_selected");
          statusSpan.style.color = "var(--color-orange)";
        }
      } else if (api.mode === "local_encrypted") {
        const hasKey = !!(api.encryptedData?.ciphertext);
        if (hasKey) {
          statusSpan.textContent = t("settings_api_key_status_encrypted");
          statusSpan.style.color = "var(--color-green)";
        } else {
          statusSpan.textContent = t("settings_api_key_status_not_set");
          statusSpan.style.color = "var(--color-orange)";
        }
      } else {
        statusSpan.textContent = t("settings_api_key_status_not_set");
        statusSpan.style.color = "var(--text-muted)";
      }
    };
    updateApiStatus();

    // ---- 更新可见性 ----
    const updateVisibility = () => {
      const api = settings.api || { mode: "secret_storage" };
      // 如果环境不支持 SecretStorage，强制使用本地加密
      if (!hasSecretStorage) {
        textInputContainer.style.display = "flex";
        secretComponentContainer.style.display = "none";
        return;
      }
      if (api.mode === "secret_storage") {
        textInputContainer.style.display = "none";
        secretComponentContainer.style.display = "flex";
        refreshSecretComponent();
      } else {
        textInputContainer.style.display = "flex";
        secretComponentContainer.style.display = "none";
      }
    };
    updateVisibility();

    // ---- 保存 update 方法供切换调用 ----
    this.updateApiStatus = updateApiStatus;

    // ---- 模式切换函数 ----
    this.switchMode = async (newMode, showConfirm = true) => {
      // 如果环境不支持 SecretStorage，禁止切换到 secret_storage
      if (newMode === "secret_storage" && !hasSecretStorage) {
        new Notice(t("notice_secret_storage_unavailable"));
        return;
      }

      const api = settings.api || { mode: "secret_storage" };
      const oldMode = api.mode;
      if (newMode === oldMode) return;

      let currentPlaintext = "";
      let hasKey = false;

      // 从旧模式读取明文
      if (oldMode === "secret_storage") {
        const name = api.secretName;
        if (name) {
          try {
            currentPlaintext = await plugin.app.secretStorage.getSecret(name) || "";
            hasKey = !!currentPlaintext;
          } catch (e) { }
        }
      } else if (oldMode === "local_encrypted") {
        const encrypted = api.encryptedData;
        if (encrypted?.ciphertext) {
          currentPlaintext = await decryptApiKey(plugin.app, encrypted.ciphertext, encrypted.salt || "");
          hasKey = !!currentPlaintext;
        }
      }

      let shouldMigrate = false;
      let customName = "";

      if (hasKey && showConfirm) {
        const confirmModal = new MigrationConfirmModal(plugin.app, newMode, async (migrate, name) => {
          shouldMigrate = migrate;
          customName = name || "";
          await this.doSwitch(newMode, shouldMigrate, customName);
        });
        confirmModal.open();
      } else {
        await this.doSwitch(newMode, false, "");
      }
    };

    this.doSwitch = async (newMode, migrate, customName) => {
      const api = settings.api || { mode: "secret_storage" };
      const oldMode = api.mode;
      let plaintext = "";

      // 从旧模式读取明文
      if (oldMode === "secret_storage") {
        const name = api.secretName;
        if (name) {
          try {
            plaintext = await plugin.app.secretStorage.getSecret(name) || "";
          } catch (e) { }
        }
      } else if (oldMode === "local_encrypted") {
        const encrypted = api.encryptedData;
        if (encrypted?.ciphertext) {
          plaintext = await decryptApiKey(plugin.app, encrypted.ciphertext, encrypted.salt || "");
        }
      }

      if (migrate && plaintext) {
        if (newMode === "secret_storage") {
          // 清理用户自定义名称，若为空则用默认
          let keyName = customName ? sanitizeSecretName(customName) : "";
          if (!keyName) keyName = "simple-wordbook-api-key";
          try {
            await plugin.app.secretStorage.setSecret(keyName, plaintext);
            api.secretName = keyName;
            api.encryptedData = null;
          } catch (e) {
            new Notice(t("notice_api_migrate_fail", e.message));
            return;
          }
        } else {
          const salt = generateSalt();
          const ciphertext = await encryptApiKey(plugin.app, plaintext, salt);
          api.encryptedData = { ciphertext, salt };
        }
      } else {
        // 不迁移：仅切换模式
        if (newMode === "secret_storage") {
          if (!api.secretName) api.secretName = "";
          api.encryptedData = null;
        } else {
          // 切换到 local_encrypted
          api.encryptedData = null;
          // 如果是从官方切换过来且旧密钥不可读，则清空 secretName
          if (oldMode === "secret_storage" && !plaintext) {
            api.secretName = "";
          }
          // 否则 secretName 保留不动
        }
      }

      api.mode = newMode;
      await plugin.saveSettings();

      this._skipCount = true;
      this.display();

      // 切换完成后重新验证
      setTimeout(() => this.triggerVerification(true), 200);

      const modeLabel = newMode === "secret_storage" ? t("settings_api_key_mode_secret") : t("settings_api_key_mode_local");
      new Notice(t("notice_api_switch_mode", modeLabel));
    };

    // ---- API 模型 ----
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

    // ---- 测试连接 ----
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

    // ===== 提示词分组标题 =====
    container.createEl("h3", { text: t("settings_prompts") });

    // ======== 内置系统提示词 ======== //

    container.createEl("h4", { text: t("settings_builtin_prompts") });

    const builtinDesc = container.createEl("p", { text: t("settings_builtin_desc") });
    builtinDesc.style.cssText = "font-size: 0.85em; color: var(--text-muted); margin: -12px 0 12px 15px;";

    // 1. 下拉选择器
    const builtinSelectSetting = new Setting(container)
      .setName(t("settings_select_builtin"))
      .addDropdown(drop => {
        const keys = getBuiltinPromptKeys();
        keys.forEach((key, idx) => drop.addOption(key, t("builtin_prompt_" + key + "_name")));
        if (keys.length > 0) drop.setValue(keys[0]);
        drop.onChange(val => {
          previewArea.value = t("builtin_prompt_" + val + "_content");
        });
        return drop;
      });

    // 2. 内容预览（只读文本域）
    const previewArea = container.createEl("textarea", { cls: "builtin-preview" });
    previewArea.readOnly = true;
    previewArea.rows = 4;
    previewArea.style.width = "100%";
    previewArea.style.marginTop = "4px";
    previewArea.style.marginBottom = "6px";
    previewArea.style.background = "var(--background-secondary)";
    previewArea.style.color = "var(--text-muted)";
    previewArea.style.fontSize = "0.9em";
    const initialKeys = getBuiltinPromptKeys();
    if (initialKeys.length > 0) previewArea.value = t("builtin_prompt_" + initialKeys[0] + "_content");

    // 3. 复制按钮
    const copyBtnContainer = container.createDiv({ cls: "builtin-copy-container" });
    copyBtnContainer.style.cssText = "display: flex; justify-content: flex-end; margin-bottom: 20px;";
    const copyBtn = copyBtnContainer.createEl("button", { text: t("settings_copy_content"), cls: "mod-cta" });
    copyBtn.addEventListener("click", async () => {
      const content = previewArea.value;
      if (!content) {
        new Notice(t("settings_copy_empty"));
        return;
      }
      try {
        await navigator.clipboard.writeText(content);
        new Notice(t("settings_copied"));
      } catch (e) {
        previewArea.select();
        document.execCommand('copy');
        new Notice(t("settings_copied"));
      }
    });

    // ======== 自定义系统提示词 ======== //

    container.createEl("h4", { text: t("settings_system_prompts") });
    const systemDesc = container.createEl("p", { text: t("settings_system_prompt_desc") });
    systemDesc.style.cssText = "font-size: 0.85em; color: var(--text-muted); margin: -12px 0 20px 15px;";

    const systemList = container.createDiv({ cls: "custom-prompts-list" });

    // 自定义系统提示词渲染函数（包含内置+自定义）
    const renderSystemPrompts = () => {
      systemList.empty();
      const prompts = settings.systemPrompts || [];
      for (let i = 0; i < prompts.length; i++) {
        const p = prompts[i];
        const item = systemList.createDiv({ cls: "custom-prompt-item" });
        const nameInput = item.createEl("input", { type: "text", placeholder: t("settings_system_prompt_name") });
        nameInput.value = p.name;
        nameInput.style.marginRight = "8px";

        // 系统提示词下拉使用 getAllSystemPromptOptions（内置+自定义）
        const systemSelect = document.createElement("select");
        systemSelect.className = "system-select";
        systemSelect.style.marginRight = "8px";
        const populateSelect = () => {
          systemSelect.innerHTML = '';
          const noneOption = document.createElement("option");
          noneOption.value = "";
          noneOption.textContent = t("settings_system_prompt_none");
          systemSelect.appendChild(noneOption);
          const allOptions = getAllSystemPromptOptions(settings);
          allOptions.forEach(pOpt => {
            const opt = document.createElement("option");
            opt.value = pOpt.key;
            opt.textContent = pOpt.type === 'builtin' ? `${pOpt.name}（${t("builtin_label")}）` : pOpt.name;
            systemSelect.appendChild(opt);
          });
          systemSelect.value = p.system_prompt || "";
        };
        populateSelect();
        systemSelect.addEventListener("change", async () => {
          p.system_prompt = systemSelect.value;
          await plugin.saveSettings();
        });

        const contentInput = item.createEl("textarea", { placeholder: t("settings_system_prompt_content") });
        contentInput.value = p.content;
        contentInput.style.flex = "1";
        const delBtn = item.createEl("button", { text: t("settings_ai_delete_prompt") });

        // ---- 删除系统提示词时关联改为默认 ----
        delBtn.addEventListener("click", async () => {
          const nameToDelete = p.name;
          // 获取当前语言下的内置默认系统提示词名称
          const keys = getBuiltinPromptKeys();
          const defaultBuiltinKey = keys.length > 0 ? "builtin_" + keys[0] : "";

          // 将所有关联该名称的自定义提示词改为内置默认
          if (settings.customPrompts) {
            for (const cp of settings.customPrompts) {
              if (cp.system_prompt === nameToDelete) {
                cp.system_prompt = defaultBuiltinKey;
              }
            }
          }
          // 如果“默认提示词”关联的是该名称，也改为内置默认
          if (settings.defaultSystemPrompt === nameToDelete) {
            settings.defaultSystemPrompt = defaultBuiltinKey;
          }

          settings.systemPrompts.splice(i, 1);
          await plugin.saveSettings();
          renderSystemPrompts();
          renderCustomPrompts();
          refreshAllSystemSelects();
        });

        // ---- 更新系统提示词关联 ----
        const saveSystem = async () => {
          const newName = nameInput.value.trim();
          const newContent = contentInput.value.trim();
          if (!newName || !newContent) {
            new Notice(t("settings_system_prompt_empty"));
            return;
          }
          if (newName !== p.name || newContent !== p.content) {
            const oldName = p.name;
            p.name = newName;
            p.content = newContent;
            if (oldName !== newName) {
              if (settings.customPrompts) {
                for (const cp of settings.customPrompts) {
                  if (cp.system_prompt === oldName) {
                    cp.system_prompt = newName;
                  }
                }
              }
              // 更新默认关联
              if (settings.defaultSystemPrompt === oldName) {
                settings.defaultSystemPrompt = newName;
              }
            }
            await plugin.saveSettings();
            renderSystemPrompts();
            renderCustomPrompts();
            refreshAllSystemSelects();
          }
        };
        nameInput.addEventListener("blur", saveSystem);
        contentInput.addEventListener("blur", saveSystem);
        nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") nameInput.blur(); });
        contentInput.addEventListener("keydown", (e) => { if (e.key === "Enter") contentInput.blur(); });
      }
      // 添加按钮
      const addRow = systemList.createDiv({ cls: "custom-prompt-add-row" });
      const addBtn = addRow.createEl("button", { text: t("settings_add_system_prompt") });
      let tempRow = null;
      addBtn.addEventListener("click", () => {
        if (tempRow) return;
        tempRow = systemList.createDiv({ cls: "custom-prompt-item" });
        const nameInput = tempRow.createEl("input", { type: "text", placeholder: t("settings_system_prompt_name") });
        const contentInput = tempRow.createEl("textarea", { placeholder: t("settings_system_prompt_content") });
        contentInput.style.flex = "1";
        const cancelBtn = tempRow.createEl("button", { text: t("settings_ai_cancel") });
        cancelBtn.addEventListener("click", () => { tempRow.remove(); tempRow = null; });
        const saveTemp = async () => {
          const name = nameInput.value.trim();
          const content = contentInput.value.trim();
          if (!name || !content) {
            new Notice(t("settings_system_prompt_empty"));
            return;
          }
          if (settings.systemPrompts.some(p => p.name === name)) {
            new Notice(t("settings_system_prompt_duplicate"));
            return;
          }
          settings.systemPrompts.push({ name, content });
          await plugin.saveSettings();
          tempRow.remove(); tempRow = null;
          renderSystemPrompts();
          refreshAllSystemSelects();
        };
        nameInput.addEventListener("blur", saveTemp);
        contentInput.addEventListener("blur", saveTemp);
        nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") nameInput.blur(); });
        contentInput.addEventListener("keydown", (e) => { if (e.key === "Enter") contentInput.blur(); });
      });
    };
    renderSystemPrompts();

    // 刷新所有关联下拉（包含内置 + 自定义）
    const refreshAllSystemSelects = () => {
      const allOptions = getAllSystemPromptOptions(settings);

      // 刷新默认提示词的下拉
      const defaultSelect = container.querySelector('.default-system-select');
      if (defaultSelect) {
        const current = defaultSelect.value;
        defaultSelect.innerHTML = '';
        const noneOpt = document.createElement('option');
        noneOpt.value = "";
        noneOpt.textContent = t("settings_system_prompt_none");
        defaultSelect.appendChild(noneOpt);
        allOptions.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.key;
          opt.textContent = p.type === 'builtin' ? `${p.name}（${t("builtin_label")}）` : p.name;
          defaultSelect.appendChild(opt);
        });
        defaultSelect.value = settings.defaultSystemPrompt || "";
      }

      // 刷新所有自定义提示词的下拉
      container.querySelectorAll('.custom-prompt-item select.system-select').forEach(sel => {
        const current = sel.value;
        sel.innerHTML = '';
        const noneOpt = document.createElement('option');
        noneOpt.value = "";
        noneOpt.textContent = t("settings_system_prompt_none");
        sel.appendChild(noneOpt);
        allOptions.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.key;
          opt.textContent = p.type === 'builtin' ? `${p.name}（${t("builtin_label")}）` : p.name;
          sel.appendChild(opt);
        });
        sel.value = current;
      });
    };

    // ===== 默认提示词关联 =====
    container.createEl("h4", { text: t("settings_ai_default_prompt") });

    // 默认提示词关联下拉包含内置 + 自定义
    new Setting(container)
      .setName(t("settings_default_system_prompt"))
      .setDesc(t("settings_default_system_prompt_desc"))
      .addDropdown(drop => {
        drop.selectEl.addClass('default-system-select');
        const populate = () => {
          drop.selectEl.empty();
          drop.addOption("", t("settings_system_prompt_none"));
          const allOptions = getAllSystemPromptOptions(settings);
          allOptions.forEach(p => {
            const label = p.type === 'builtin' ? `${p.name}（${t("builtin_label")}）` : p.name;
            drop.addOption(p.key, label);
          });
          drop.setValue(settings.defaultSystemPrompt || "");
        };
        populate();
        drop.onChange(async (val) => {
          settings.defaultSystemPrompt = val;
          await plugin.saveSettings();
        });
        drop._populate = populate;
        return drop;
      });

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

        // 系统提示词下拉选择器
        const systemSelect = document.createElement("select");
        systemSelect.className = "system-select";
        systemSelect.style.marginRight = "8px";
        //systemSelect.style.minWidth = "80px";
        nameInput.after(systemSelect);
        // 填充选项的函数
        const populateSelect = () => {
          systemSelect.empty();
          systemSelect.innerHTML = '';
          const noneOption = document.createElement("option");
          noneOption.value = "";
          noneOption.textContent = t("settings_system_prompt_none");
          systemSelect.appendChild(noneOption);
          const allOptions = getAllSystemPromptOptions(settings);
          allOptions.forEach(pOpt => {
            const opt = document.createElement("option");
            opt.value = pOpt.key;
            opt.textContent = pOpt.type === 'builtin' ? `${pOpt.name}（${t("builtin_label")}）` : pOpt.name;
            systemSelect.appendChild(opt);
          });
          systemSelect.value = p.system_prompt || "";
        };
        populateSelect();
        systemSelect.addEventListener("change", async () => {
          p.system_prompt = systemSelect.value;
          await plugin.saveSettings();
        });

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

        const systemSelect = document.createElement("select");
        systemSelect.className = "system-select";
        systemSelect.style.marginRight = "8px";
        const populateSelect = () => {
          systemSelect.innerHTML = '';
          const noneOption = document.createElement("option");
          noneOption.value = "";
          noneOption.textContent = t("settings_system_prompt_none");
          systemSelect.appendChild(noneOption);
          const allOptions = getAllSystemPromptOptions(settings);
          allOptions.forEach(pOpt => {
            const opt = document.createElement("option");
            opt.value = pOpt.key;
            opt.textContent = pOpt.type === 'builtin' ? `${pOpt.name}（${t("builtin_label")}）` : pOpt.name;
            systemSelect.appendChild(opt);
          });
        };
        populateSelect();
        // 默认选中内置“默认”
        const keys = getBuiltinPromptKeys();
        const defaultKey = keys.length > 0 ? "builtin_" + keys[0] : "";
        if (defaultKey) {
          systemSelect.value = defaultKey;
        }
        nameInput.after(systemSelect);

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
          // 保存时包含 system_prompt
          settings.customPrompts.push({ name, content, system_prompt: systemSelect.value });
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

    // 启动时自动验证密钥可读性（延迟执行，确保 UI 已渲染）
    setTimeout(() => {
      this.triggerVerification(true);
    }, 300);
  }

  // ===== 验证密钥是否可读（纯本地初始加载插件验证） =====
  async verifyKeyReadable() {
    const plugin = this.plugin;
    const settings = plugin.settings;
    const api = settings.api || { mode: "secret_storage" };

    // 验证中状态
    this._verificationResult = { status: "verifying", message: t("settings_api_key_verifying") };
    this.updateApiStatus();

    try {
      if (api.mode === "secret_storage") {
        const name = api.secretName || "";
        if (!name) {
          this._verificationResult = { status: "empty", message: t("settings_api_key_status_not_selected") };
          this.updateApiStatus();
          return;
        }
        try {
          const value = await plugin.app.secretStorage.getSecret(name);
          if (value && value.length > 0) {
            this._verificationResult = { status: "valid", message: t("settings_api_key_status_associated", name) + " ✅" };
          } else {
            this._verificationResult = { status: "missing", message: t("settings_api_key_status_missing", name) };
            }
        } catch (e) {
          this._verificationResult = { status: "error", message: t("settings_api_key_status_error") };
        }
      } else if (api.mode === "local_encrypted") {
        const encrypted = api.encryptedData;
        if (!encrypted || !encrypted.ciphertext) {
          this._verificationResult = { status: "empty", message: t("settings_api_key_status_not_set") };
          this.updateApiStatus();
          return;
        }
        try {
          const plaintext = await decryptApiKey(plugin.app, encrypted.ciphertext, encrypted.salt || "");
          if (plaintext && plaintext.length > 0) {
            this._verificationResult = { status: "valid", message: t("settings_api_key_status_encrypted") + " ✅" };
          } else {
            this._verificationResult = { status: "corrupted", message: t("settings_api_key_status_corrupted") };
          }
        } catch (e) {
          this._verificationResult = { status: "corrupted", message: t("settings_api_key_status_corrupted") };
        }
      } else {
        this._verificationResult = { status: "empty", message: t("settings_api_key_status_not_set") };
      }
    } catch (e) {
      this._verificationResult = { status: "error", message: t("settings_api_key_status_error") };
    }

    this._verificationCacheTime = Date.now();
    this.updateApiStatus();
  }

  // ===== 触发验证（带防抖和缓存） =====
  triggerVerification(force = false) {
    // 如果 force=false 且 5 秒内有验证结果，不重复验证
    if (!force && this._verificationResult &&
      Date.now() - this._verificationCacheTime < 5000) {
      this.updateApiStatus();
      return;
    }
    // 异步执行验证，不阻塞 UI
    this.verifyKeyReadable();
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

  async showNewWordbookModal() {
    const { app, plugin } = this;
    let selectedFolder = ''; // 空字符串表示根目录
    let folderDisplay = t("settings_new_wordbook_root");
    let fileNameInput = null;

    const modal = new Modal(app);
    modal.titleEl.setText(t("settings_new_wordbook"));

    // 文件夹选择区域
    const folderSetting = new Setting(modal.contentEl)
      .setName(t("settings_new_wordbook_folder"))
      .setDesc(`${t("settings_new_wordbook_selected")} ${folderDisplay}`)
      .addButton(btn => {
        btn.setButtonText(t("settings_new_wordbook_select_folder"))
          .onClick(() => {
            new FolderSuggestModal(app, (folderPath) => {
              selectedFolder = folderPath;
              folderDisplay = folderPath === '' ? t("settings_new_wordbook_root") : folderPath;
              folderSetting.setDesc(`${t("settings_new_wordbook_selected")} ${folderDisplay}`);
            }).open();
          });
      });

    // 文件名输入
    const nameSetting = new Setting(modal.contentEl)
      .setName(t("settings_new_wordbook_file_name"))
      .setDesc(t("settings_new_wordbook_file_name_desc"))
      .addText(text => {
        text.setPlaceholder(t("settings_new_wordbook_placeholder"))
          .inputEl.style.width = "100%";
        fileNameInput = text;
      });

    // 按钮
    const buttonDiv = modal.contentEl.createDiv({ cls: "modal-button-container" });
    buttonDiv.style.cssText = "display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;";
    const confirmBtn = buttonDiv.createEl("button", { text: t("save"), cls: "mod-cta" });
    const cancelBtn = buttonDiv.createEl("button", { text: t("cancel") });

    const doCreate = async () => {
      if (!fileNameInput) return;
      const fileName = fileNameInput.getValue().trim();
      if (!fileName) {
        new Notice(t("settings_new_wordbook_enter_name"));
        return;
      }
      // 清理文件名（移除非法字符）
      const cleanName = fileName.replace(/[^a-zA-Z0-9\-_\u4e00-\u9fa5]/g, '_');
      const fullPath = selectedFolder ? `${selectedFolder}/${cleanName}.json` : `${cleanName}.json`;
      try {
        // 检查文件是否已存在
        const existing = app.vault.getAbstractFileByPath(fullPath);
        if (existing) {
          new Notice(t("settings_new_wordbook_file_exists", fullPath));
          return;
        }
        // 确保文件夹存在
        if (selectedFolder) {
          const dir = app.vault.getAbstractFileByPath(selectedFolder);
          if (!dir) {
            await app.vault.createFolder(selectedFolder);
          }
        }
        // 创建空 JSON 文件
        await app.vault.create(fullPath, JSON.stringify([], null, 2));
        // 自动添加到设置列表
        plugin.settings.wordbookFiles.push({
          path: fullPath,
          name: cleanName,
          enabled: true,
          readonly: false
        });
        await plugin.saveSettings();
        await plugin.reloadAllCards();
        await plugin.highlighter.refresh();
        plugin.app.workspace.trigger("simple-wordbook:data-updated");
        new Notice(t("settings_new_wordbook_created", fullPath));
        modal.close();
        // 刷新设置界面
        this.display();
      } catch (e) {
        new Notice(t("settings_new_wordbook_failed", e.message));
      }
    };

    confirmBtn.addEventListener("click", doCreate);
    cancelBtn.addEventListener("click", () => modal.close());
    // 支持回车
    if (fileNameInput) {
      fileNameInput.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") doCreate();
      });
      modal.open();
      setTimeout(() => fileNameInput.inputEl.focus(), 50);
    } else {
      modal.open();
    }
  }

  // ===== 单词本管理辅助方法 =====
  async relocateWordbookFile(oldEntry, index) {
    // 弹出文件选择器，让用户选择一个 JSON 文件
    const files = this.app.vault.getFiles().filter(f => f.extension === "json");
    if (files.length === 0) {
      new Notice(t("notice_no_json"));
      return;
    }
    // 使用现有的 FileSuggestionModal
    const modal = new FileSuggestionModal(this.app, files, async (file) => {
      // 检查是否已被其他单词本使用（可选）
      const conflict = this.plugin.settings.wordbookFiles.some((f, i) => i !== index && f.path === file.path);
      if (conflict) {
        new Notice(t("notice_file_already_added"));
        return;
      }
      // 更新该条目
      oldEntry.path = file.path;
      oldEntry.name = file.basename;
      await this.plugin.saveSettings();
      await this.plugin.reloadAllCards();
      await this.plugin.highlighter.refresh();
      this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
      new Notice(t("relocate_success", file.path));
      this.display(); // 刷新设置界面
    });
    modal.open();
  }

  // ===== 导入功能：选择 TXT 文件 =====
  async selectTxtFileForImport(type) {
    const files = this.app.vault.getFiles().filter(f => f.extension === "txt");
    if (files.length === 0) {
      new Notice(t("import_no_files"));
      return;
    }
    const modal = new FileSuggestionModal(this.app, files, async (file) => {
      await this.importFromTxt(file, type);
    });
    modal.open();
  }

  // ===== 导入 TXT 文件逻辑 =====
  async importFromTxt(file, type) {
    const content = await this.app.vault.read(file);
    const lines = content.split('\n');
    const words = new Set();

    // 逐行解析
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // 检测分隔符：逗号、中文逗号、分号、制表符
      if (/[,，;；\t]/.test(trimmed)) {
        const parts = trimmed.split(/[,，;；\t]/)
          .map(s => s.trim())
          .filter(s => s.length > 0);
        for (const part of parts) {
          words.add(part.toLowerCase());
        }
      } else {
        // 整行作为一个条目（保留空格，但转为小写）
        words.add(trimmed.toLowerCase());
      }
    }

    if (words.size === 0) {
      new Notice(t("import_no_words"));
      return;
    }

    const isMastered = (type === 'mastered');
    const store = this.plugin.masteryStore;

    if (isMastered) {
      await this.importToMastered(words, store);
    } else {
      await this.importToIgnored(words, store);
    }

    // 刷新视图
    await this.plugin.highlighter.refresh();
    this.plugin.app.workspace.trigger("simple-wordbook:data-updated");
    this._skipCount = true;
    this.display();
  }

  // ===== 导入到掌握（含去重和冲突处理） =====
  async importToMastered(words, store) {
    const mode = this.plugin.settings.masteryMode;
    const existingKeys = new Set(Object.keys(store.masteryData));
    const ignoredKeys = new Set(Object.keys(store.ignoredData));
    let addedCount = 0;

    const allBookPaths = this.plugin.settings.wordbookFiles
      .filter(f => f.enabled)
      .map(f => f.path);

    const toAdd = [];

    for (const word of words) {
      // 检查是否已被忽略（忽略优先）
      let isIgnored = false;
      if (mode === "global") {
        if (ignoredKeys.has(word)) isIgnored = true;
      } else {
        for (const bookPath of allBookPaths) {
          const key = `${bookPath}::${word}`;
          if (ignoredKeys.has(key)) { isIgnored = true; break; }
        }
      }
      if (isIgnored) continue;

      // 检查是否已掌握
      if (mode === "global") {
        if (!existingKeys.has(word)) {
          toAdd.push(word);
          addedCount++;
        }
      } else {
        for (const bookPath of allBookPaths) {
          const key = `${bookPath}::${word}`;
          if (!existingKeys.has(key)) {
            toAdd.push({ key, word });
            addedCount++;
          }
        }
      }
    }

    if (addedCount === 0) {
      new Notice(t("import_no_new"));
      return;
    }

    if (mode === "global") {
      for (const word of toAdd) {
        store.masteryData[word] = { mastered: true, updatedAt: store.getLocalDateTimeString() };
      }
    } else {
      for (const item of toAdd) {
        store.masteryData[item.key] = { mastered: true, updatedAt: store.getLocalDateTimeString() };
      }
    }

    await store.saveMastery();

    // ----- 同步复习等级为 5（仅当复习记录存在时才更新） -----
    const studyStore = this.plugin.studyStore;
    if (mode === "global") {
      for (const word of toAdd) {
        // 先检查是否存在复习记录
        if (studyStore.getReviewByKey(word)) {
          await studyStore.setReviewLevel(word, 5);
        }
        // 无记录：不创建，仅保持 masteryData 中的掌握状态
      }
    } else {
      for (const item of toAdd) {
        // 先检查是否存在复习记录
        if (studyStore.getReviewByKey(item.key)) {
          await studyStore.setReviewLevel(item.key, 5);
        }
        // 无记录：不创建，仅保持 masteryData 中的掌握状态
      }
    }

    const label = t("import_mastered");
    new Notice(t("import_success", addedCount, label));
  }

  // ===== 导入到忽略（含去重和冲突处理） =====
  async importToIgnored(words, store) {
    const mode = this.plugin.settings.masteryMode;
    const existingKeys = new Set(Object.keys(store.ignoredData));
    let addedCount = 0;

    const allBookPaths = this.plugin.settings.wordbookFiles
      .filter(f => f.enabled)
      .map(f => f.path);

    const toAdd = [];

    for (const word of words) {
      if (mode === "global") {
        if (!existingKeys.has(word)) {
          // 如果存在于掌握中，移除它
          if (store.masteryData[word]) {
            delete store.masteryData[word];
          }
          toAdd.push(word);
          addedCount++;
        }
      } else {
        for (const bookPath of allBookPaths) {
          const key = `${bookPath}::${word}`;
          if (!existingKeys.has(key)) {
            // 如果存在于掌握中，移除它
            if (store.masteryData[key]) {
              delete store.masteryData[key];
            }
            toAdd.push({ key, word });
            addedCount++;
          }
        }
      }
    }

    if (addedCount === 0) {
      new Notice(t("import_no_new"));
      return;
    }

    if (mode === "global") {
      for (const word of toAdd) {
        store.ignoredData[word] = { ignored: true, updatedAt: store.getLocalDateTimeString() };
      }
    } else {
      for (const item of toAdd) {
        store.ignoredData[item.key] = { ignored: true, updatedAt: store.getLocalDateTimeString() };
      }
    }

    await store.saveIgnored();

    // ----- 同步复习等级为 5（仅当复习记录存在时才更新） -----
    const studyStore = this.plugin.studyStore;
    if (mode === "global") {
      for (const word of toAdd) {
        // 先检查是否存在复习记录
        if (studyStore.getReviewByKey(word)) {
          await studyStore.setReviewLevel(word, 5);
        }
        // 无记录：不创建，仅保持 ignoredData 中的忽略状态
      }
    } else {
      for (const item of toAdd) {
        // 先检查是否存在复习记录
        if (studyStore.getReviewByKey(item.key)) {
          await studyStore.setReviewLevel(item.key, 5);
        }
        // 无记录：不创建，仅保持 ignoredData 中的忽略状态
      }
    }

    const label = t("import_ignored");
    new Notice(t("import_success", addedCount, label));
  }

  // 弹出导出模态框（掌握/忽略）
  showExportWordsModal(type) {
    new ExportSimpleModal(this.app, this.plugin, type).open();
  }
}

// ========== 文件选择模态窗 ==========
class FileSuggestionModal extends FuzzySuggestModal {
  constructor(app, files, onChoose) { super(app); this.files = files; this.onChoose = onChoose; }
  getItems() { return this.files; }
  getItemText(item) { return item.path; }
  onChooseItem(item) { this.onChoose(item); }
}

// ========== 文件夹选择模态窗（新建单词本时调用） ==========
class FolderSuggestModal extends FuzzySuggestModal {
  constructor(app, onChoose) {
    super(app);
    this.onChoose = onChoose;
  }
  getItems() {
    // 获取所有文件夹（包括根目录，用空字符串表示）
    const folders = this.app.vault.getAllLoadedFiles()
      .filter(f => f instanceof TFolder)
      .map(f => f.path);
    // 添加根目录选项（空字符串）
    return ['', ...folders];
  }
  getItemText(item) {
    return item === '' ? t("settings_new_wordbook_root") : item;
  }
  onChooseItem(item) {
    this.onChoose(item);
  }
}

// ========== 单词本导出模态窗 ==========
class ExportModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;

    // 初始化状态
    this.selectedBooks = new Set();
    this.range = "all";
    this.format = "markdown";
    this.options = {
      includePhonetic: true,
      includeAliases: true,
      includeDefinition: true,
      includeSource: true,
      includeStatus: true,
      includeLang: false, 
      convertToHtml: true,
      oneLinePerWord: false
    };
    this.folderPath = "";
    this.fileName = "wordbook_export";
    this._folderDisplay = t("settings_new_wordbook_root");
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("export-modal");
    this.titleEl.setText(t("export_modal_title"));

    // ---- 1. 选择单词本 ----
    new Setting(contentEl)
      .setName(t("export_select_wordbooks"))
      .setDesc(t("export_select_hint"));

    const bookList = contentEl.createDiv({ cls: "export-book-list" });
    bookList.style.cssText = "margin: 4px 0 12px 0; padding: 8px 12px; border: 1px solid var(--background-modifier-border); border-radius: 6px; max-height: 200px; overflow-y: auto;";

    const enabledBooks = this.plugin.settings.wordbookFiles.filter(f => f.enabled);

    for (const book of enabledBooks) {
      const item = bookList.createDiv({ cls: "export-book-item" });
      item.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 2px 0;";

      const checkbox = item.createEl("input", { type: "checkbox" });
      checkbox.value = book.path;
      checkbox.checked = false;
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          this.selectedBooks.add(book.path);
        } else {
          this.selectedBooks.delete(book.path);
        }
      });

      const label = item.createSpan({ text: `${book.name} (${book.path})` });
      label.style.cssText = "font-size: 0.9em; color: var(--text-normal);";
    }

    // ---- 2. 导出范围 ----
    new Setting(contentEl)
      .setName(t("export_range"))
      .setDesc(t("export_range_hint"))
      .addDropdown(drop => {
        drop.addOption("all", t("export_range_all"))
          .addOption("learning", t("export_range_learning"))
          .addOption("mastered", t("export_range_mastered"))
          .addOption("ignored", t("export_range_ignored"))
          .setValue(this.range)
          .onChange(val => { this.range = val; });
        return drop;
      });

    // ---- 3. 导出格式 ----
    new Setting(contentEl)
      .setName(t("export_format"))
      .addDropdown(drop => {
        drop.addOption("markdown", t("export_format_markdown"))
          .addOption("anki", t("export_format_anki"))
          .setValue(this.format)
          .onChange(val => {
            this.format = val;
            // 更新扩展名显示
            const extSpan = contentEl.querySelector('.export-extension');
            if (extSpan) {
              extSpan.textContent = val === "markdown" ? ".md" : ".txt";
            }
            // 显示/隐藏 "转换为 HTML" 选项
            const convertRow = contentEl.querySelector('.export-convert-row');
            if (convertRow) {
              convertRow.style.display = val === "anki" ? "flex" : "none";
            }
            // 显示/隐藏 "每行一个单词" 选项
            const oneLineRow = contentEl.querySelector('.export-one-line-row');
            if (oneLineRow) {
              oneLineRow.style.display = val === "anki" ? "flex" : "none";
            }
          });
        return drop;
      });

    // ---- 4. 导出选项 ----
    new Setting(contentEl)
      .setName(t("export_options"));

    const optionsContainer = contentEl.createDiv({ cls: "export-options-container" });
    optionsContainer.style.cssText = "margin: 4px 0 12px 0; padding: 8px 12px; border: 1px solid var(--background-modifier-border); border-radius: 6px;";

    // 包含音标
    const phoneticRow = optionsContainer.createDiv({ cls: "export-option-row" });
    phoneticRow.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 2px 0;";
    const phoneticCheck = phoneticRow.createEl("input", { type: "checkbox" });
    phoneticCheck.checked = true;
    phoneticCheck.addEventListener("change", () => {
      this.options.includePhonetic = phoneticCheck.checked;
    });
    phoneticRow.createSpan({ text: t("export_include_phonetic") });

    // 包含别名
    const aliasesRow = optionsContainer.createDiv({ cls: "export-option-row" });
    aliasesRow.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 2px 0;";
    const aliasesCheck = aliasesRow.createEl("input", { type: "checkbox" });
    aliasesCheck.checked = true;
    aliasesCheck.addEventListener("change", () => {
      this.options.includeAliases = aliasesCheck.checked;
    });
    aliasesRow.createSpan({ text: t("export_include_aliases") });

    // 包含释义
    const defRow = optionsContainer.createDiv({ cls: "export-option-row" });
    defRow.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 2px 0;";
    const defCheck = defRow.createEl("input", { type: "checkbox" });
    defCheck.checked = true;
    defCheck.addEventListener("change", () => {
      this.options.includeDefinition = defCheck.checked;
    });
    defRow.createSpan({ text: t("export_include_definition") });

    // 包含来源
    const sourceRow = optionsContainer.createDiv({ cls: "export-option-row" });
    sourceRow.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 2px 0;";
    const sourceCheck = sourceRow.createEl("input", { type: "checkbox" });
    sourceCheck.checked = true;
    sourceCheck.addEventListener("change", () => {
      this.options.includeSource = sourceCheck.checked;
    });
    sourceRow.createSpan({ text: t("export_include_source") });

    // 包含状态
    const statusRow = optionsContainer.createDiv({ cls: "export-option-row" });
    statusRow.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 2px 0;";
    const statusCheck = statusRow.createEl("input", { type: "checkbox" });
    statusCheck.checked = true;
    statusCheck.addEventListener("change", () => {
      this.options.includeStatus = statusCheck.checked;
    });
    statusRow.createSpan({ text: t("export_include_status") });

    // 发音语言 (lang)字段
    const langRow = optionsContainer.createDiv({ cls: "export-option-row" });
    langRow.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 2px 0;";
    const langCheck = langRow.createEl("input", { type: "checkbox" });
    langCheck.checked = false;
    langCheck.addEventListener("change", () => {
      this.options.includeLang = langCheck.checked;
    });
    langRow.createSpan({ text: t("export_include_lang") });

    // 转换为 HTML（仅 TXT）
    const convertRow = optionsContainer.createDiv({ cls: "export-option-row export-convert-row" });
    convertRow.style.cssText = "display: flex; flex-direction: column; gap: 4px; padding: 2px 0;";

    // 复选框行
    const convertCheckRow = convertRow.createDiv({ cls: "export-option-row" });
    convertCheckRow.style.cssText = "display: flex; align-items: center; gap: 8px;";

    const convertCheck = convertCheckRow.createEl("input", { type: "checkbox" });
    convertCheck.checked = true;
    convertCheck.addEventListener("change", () => {
      this.options.convertToHtml = convertCheck.checked;
    });
    convertCheckRow.createSpan({ text: t("export_convert_html") });

    // 提示文字紧跟在复选框下方
    const convertHint = convertRow.createDiv({ cls: "export-option-hint" });
    convertHint.style.cssText = "font-size: 0.8em; color: var(--text-muted); padding-left: 24px; line-height: 1.4;";
    convertHint.textContent = t("export_convert_hint");

    // ---- 每行一个单词（仅 TXT） ----
    const oneLineRow = optionsContainer.createDiv({ cls: "export-option-row export-one-line-row" });
    oneLineRow.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 2px 0;";
    const oneLineCheck = oneLineRow.createEl("input", { type: "checkbox" });
    oneLineCheck.checked = false;   // 默认不勾选
    oneLineCheck.addEventListener("change", () => {
      this.options.oneLinePerWord = oneLineCheck.checked;
    });
    oneLineRow.createSpan({ text: t("export_one_line_per_word") });

    // 仅当导出格式为 Anki (TXT) 时显示 转换为 HTML
    if (this.format === "anki") {
      convertRow.style.display = "flex";
    } else {
      convertRow.style.display = "none";
    }
    // 仅当导出格式为 Anki (TXT) 时显示 每行一个单词
    if (this.format === "anki") {
      oneLineRow.style.display = "flex";
    } else {
      oneLineRow.style.display = "none";
    }

    // ---- 5. 保存位置 ----
    const locationContainer = contentEl.createDiv({ cls: "export-location-container" });
    locationContainer.style.cssText = "margin: 12px 0 8px 0;";

    // ---- 第一行：文件夹选择 ----
    const folderRow = locationContainer.createDiv({ cls: "export-folder-row" });
    folderRow.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 4px 0;";

    const folderLabel = folderRow.createSpan({ text: t("export_save_location") });
    folderLabel.style.cssText = "flex-shrink: 0; font-size: var(--font-ui-small); color: var(--text-normal); min-width: 70px;";

    const folderBtn = folderRow.createEl("button", { text: t("export_select_folder") });
    folderBtn.style.cssText = "flex-shrink: 0;";

    const folderDisplay = folderRow.createSpan({ text: this._folderDisplay });
    folderDisplay.style.cssText = "color: var(--text-muted); font-size: 0.85em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;";

    folderBtn.addEventListener("click", () => {
      new FolderSuggestModal(this.app, (folderPath) => {
        this.folderPath = folderPath;
        this._folderDisplay = folderPath === '' ? t("settings_new_wordbook_root") : folderPath;
        folderDisplay.textContent = this._folderDisplay;
      }).open();
    });

    // ---- 第二行：文件名输入 ----
    const nameRow = locationContainer.createDiv({ cls: "export-name-row" });
    nameRow.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 4px 0;";

    const nameLabel = nameRow.createSpan({ text: t("export_filename") });
    nameLabel.style.cssText = "flex-shrink: 0; font-size: var(--font-ui-small); color: var(--text-normal); min-width: 70px;";

    const nameInput = nameRow.createEl("input", { type: "text" });
    nameInput.value = this.fileName;
    nameInput.style.cssText = "flex: 1; min-width: 120px; padding: 4px 8px; border-radius: 4px; border: 1px solid var(--background-modifier-border); background: var(--background-primary); color: var(--text-normal);";

    const extSpan = nameRow.createSpan({ cls: "export-extension", text: this.format === "markdown" ? ".md" : ".txt" });
    extSpan.style.cssText = "flex-shrink: 0; font-size: var(--font-ui-small); color: var(--text-muted);";

    nameInput.addEventListener("input", () => {
    });

    // 保存输入框引用
    this.nameInput = nameInput;

    // ---- 6. 底部按钮 ----
    const buttonDiv = contentEl.createDiv({ cls: "modal-button-container" });
    buttonDiv.style.cssText = "display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;";

    const cancelBtn = buttonDiv.createEl("button", { text: t("cancel") });
    cancelBtn.addEventListener("click", () => this.close());

    const exportBtn = buttonDiv.createEl("button", { text: t("export_button"), cls: "mod-cta" });
    exportBtn.addEventListener("click", () => this.doExport());
  }

  // 执行导出
  async doExport() {
    // 1. 校验：至少选择一个单词本
    if (this.selectedBooks.size === 0) {
      new Notice(t("export_no_wordbook"));
      return;
    }

    // 2. 读取所有选中的卡片
    const allCards = [];
    for (const bookPath of this.selectedBooks) {
      const cards = await WordbookParser.parseFile(this.app, bookPath);
      for (const card of cards) {
        card.sourceFile = bookPath;
        allCards.push(card);
      }
    }

    if (allCards.length === 0) {
      new Notice(t("export_no_word"));
      return;
    }

    // 3. 按范围过滤
    let filteredCards = allCards;
    if (this.range !== "all") {
      filteredCards = allCards.filter(card => {
        const key = getStudyKey(card.word, card.sourceFile);
        const isMastered = this.plugin.masteryStore.isMastered(key);
        const isIgnored = this.plugin.masteryStore.isIgnored(key);

        if (this.range === "learning") return !isMastered && !isIgnored;
        if (this.range === "mastered") return isMastered;
        if (this.range === "ignored") return isIgnored;
        return true;
      });
    }

    if (filteredCards.length === 0) {
      new Notice(t("export_no_word"));
      return;
    }

    // 4. 生成内容
    const isMarkdown = this.format === "markdown";
    const extension = isMarkdown ? "md" : "txt";

    // 从输入框获取文件名
    let fileName = this.nameInput ? this.nameInput.value.trim() : this.fileName;
    if (!fileName) fileName = "wordbook_export";

    let content;
    if (isMarkdown) {
      content = generateMarkdownContent(
        filteredCards,
        fileName,
        this.options,
        this.plugin
      );
    } else {
      content = generateAnkiTsvContent(
        filteredCards,
        this.options,
        this.plugin
      );
    }

    // 5. 构建完整路径
    const fullPath = normalizePath(
      this.folderPath ? `${this.folderPath}/${fileName}.${extension}` : `${fileName}.${extension}`
    );

    // 6. 检查文件是否存在
    const existing = this.app.vault.getAbstractFileByPath(fullPath);
    if (existing) {
      const confirmed = confirm(t("export_overwrite_confirm"));
      if (!confirmed) return;
      // 使用 modify 覆盖已存在文件
      await this.app.vault.modify(existing, content);
    } else {
      // 7. 确保文件夹存在
      if (this.folderPath) {
        const dir = this.app.vault.getAbstractFileByPath(this.folderPath);
        if (!dir) {
          await this.app.vault.createFolder(this.folderPath);
        }
      }
      // 8. 写入文件
      await this.app.vault.create(fullPath, content);
    }

    new Notice(t("export_success", fullPath));
    this.close();
  }
}

// ========== 单词卡片导出模态框 ==========
class ExportSingleWordModal extends Modal {
  constructor(app, plugin, wordObj) {
    super(app);
    this.plugin = plugin;
    this.wordObj = wordObj;
    this.selectedFolder = '';
    this.folderDisplay = t("settings_new_wordbook_root");
    this.fileName = this.sanitizeFileName(wordObj.word) + '.md';
  }

  // 清理非法文件名字符（替换为下划线）
  sanitizeFileName(name) {
    return name.replace(/[\\/:*?"<>|]/g, '_').trim() || 'untitled';
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.titleEl.setText(t("export_single_card"));

    // ---- 文件夹选择 ----
    const folderSetting = new Setting(contentEl)
      .setName(t("export_save_location"))
      .setDesc(`${t("settings_new_wordbook_selected")} ${this.folderDisplay}`)
      .addButton(btn => {
        btn.setButtonText(t("export_select_folder"))
          .onClick(() => {
            new FolderSuggestModal(this.app, (folderPath) => {
              this.selectedFolder = folderPath;
              this.folderDisplay = folderPath === '' ? t("settings_new_wordbook_root") : folderPath;
              folderSetting.setDesc(`${t("settings_new_wordbook_selected")} ${this.folderDisplay}`);
            }).open();
          });
      });

    // ---- 文件名输入 ----
    const nameSetting = new Setting(contentEl)
      .setName(t("export_filename"))
      .addText(text => {
        text.setValue(this.fileName);
        text.inputEl.style.width = "100%";
        text.onChange(val => {
          this.fileName = val; // 用户可自由修改
        });
        // 自动选中文件名主体部分（方便直接修改单词名，保留扩展名）
        setTimeout(() => {
          const input = text.inputEl;
          const dotIndex = input.value.lastIndexOf('.');
          if (dotIndex > 0) input.setSelectionRange(0, dotIndex);
        }, 50);
        return text;
      });

    // ---- 底部按钮 ----
    const buttonDiv = contentEl.createDiv({ cls: "modal-button-container" });
    buttonDiv.style.cssText = "display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;";

    const cancelBtn = buttonDiv.createEl("button", { text: t("cancel") });
    cancelBtn.addEventListener("click", () => this.close());

    const exportBtn = buttonDiv.createEl("button", { text: t("export_button"), cls: "mod-cta" });
    exportBtn.addEventListener("click", () => this.doExport());
  }

  async doExport() {
    let fileName = this.fileName.trim();
    if (!fileName) {
      new Notice(t("export_enter_filename"));
      return;
    }
    // 确保以 .md 结尾
    if (!fileName.endsWith('.md')) {
      fileName += '.md';
    }

    const fullPath = normalizePath(
      this.selectedFolder ? `${this.selectedFolder}/${fileName}` : fileName
    );

    // ---- 生成 Markdown 内容（复用现有函数） ----
    const card = this.wordObj;
    const lines = [`## ${card.word}`, ''];

    // 音标
    lines.push(`**${t("export_phonetic_label")}** ${card.phonetic || ''}`, '');
    // 别名
    if (card.aliases && card.aliases.length > 0) {
      lines.push(`**${t("export_aliases_label")}** ${card.aliases.join(', ')}`, '');
    }
    // 来源
    const source = card.sourceFile?.split('/').pop() || '';
    lines.push(`**${t("export_source_label")}** ${source}`, '');
    // 状态（复用全局函数）
    const status = getStatusLabel(card, this.plugin);
    lines.push(`**${t("export_status_label")}** ${status}`, '');

    // 定义章节（复用全局函数）
    const sections = parseSectionsForExport(card.definition || '');
    for (const section of sections) {
      lines.push(`**${section.title}**`);
      lines.push('');
      lines.push(section.content);
      lines.push('');
    }

    const content = lines.join('\n') + '\n'; // 末尾换行

    // ---- 写入文件 ----
    const existing = this.app.vault.getAbstractFileByPath(fullPath);
    try {
      if (existing) {
        const confirmed = confirm(t("export_overwrite_confirm"));
        if (!confirmed) return;
        await this.app.vault.modify(existing, content);
      } else {
        // 确保文件夹存在
        if (this.selectedFolder) {
          const dir = this.app.vault.getAbstractFileByPath(this.selectedFolder);
          if (!dir) await this.app.vault.createFolder(this.selectedFolder);
        }
        await this.app.vault.create(fullPath, content);
      }
      new Notice(t("export_success", fullPath));

      this.close();
    } catch (e) {
      console.error("Export failed:", e);
      new Notice(t("export_failed"));
    }
  }
}

// ========== 导出模态框（掌握/忽略） ==========
class ExportSimpleModal extends Modal {
  constructor(app, plugin, type) {
    super(app);
    this.plugin = plugin;
    this.type = type; // 'mastered' 或 'ignored'
    this.selectedFolder = '';
    this.folderDisplay = t("settings_new_wordbook_root");
    this.fileNameInput = null;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.titleEl.setText(this.type === 'mastered' ? t("export_mastered") : t("export_ignored"));

    // 文件夹选择
    const folderSetting = new Setting(contentEl)
      .setName(t("export_save_location"))
      .setDesc(`${t("settings_new_wordbook_selected")} ${this.folderDisplay}`)
      .addButton(btn => {
        btn.setButtonText(t("export_select_folder"))
          .onClick(() => {
            new FolderSuggestModal(this.app, (folderPath) => {
              this.selectedFolder = folderPath;
              this.folderDisplay = folderPath === '' ? t("settings_new_wordbook_root") : folderPath;
              folderSetting.setDesc(`${t("settings_new_wordbook_selected")} ${this.folderDisplay}`);
            }).open();
          });
      });

    // 文件名输入
    const nameSetting = new Setting(contentEl)
      .setName(t("export_filename"))
      .addText(text => {
        const defaultName = this.type === 'mastered' ? t("export_mastered_file_name") : t("export_ignored_file_name");
        text.setValue(defaultName);
        text.inputEl.style.width = "100%";
        this.fileNameInput = text;
      });

    // 按钮
    const buttonDiv = contentEl.createDiv({ cls: "modal-button-container" });
    buttonDiv.style.cssText = "display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;";
    const cancelBtn = buttonDiv.createEl("button", { text: t("cancel") });
    cancelBtn.addEventListener("click", () => this.close());

    const exportBtn = buttonDiv.createEl("button", { text: t("export_export"), cls: "mod-cta" });
    exportBtn.addEventListener("click", () => this.doExport());

    // 回车触发导出
    if (this.fileNameInput) {
      this.fileNameInput.inputEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.doExport();
      });
      setTimeout(() => this.fileNameInput.inputEl.focus(), 50);
    }
  }

  async doExport() {
    const fileName = this.fileNameInput ? this.fileNameInput.getValue().trim() : '';
    if (!fileName) {
      new Notice(t("settings_new_wordbook_enter_name"));
      return;
    }
    // 确保扩展名 .txt
    let finalFileName = fileName;
    if (!finalFileName.endsWith('.txt')) {
      finalFileName += '.txt';
    }
    const fullPath = this.selectedFolder ? `${this.selectedFolder}/${finalFileName}` : finalFileName;

    // 收集单词
    const allCards = this.plugin.getAllCards();
    const masteryStore = this.plugin.masteryStore;
    const mode = this.plugin.settings.masteryMode;
    const wordMap = new Map(); // key: 小写单词, value: 原始单词（保留首次遇到的大小写）

    for (const card of allCards) {
      let key;
      if (mode === "global") {
        key = card.word.toLowerCase();
      } else {
        key = `${card.sourceFile}::${card.word.toLowerCase()}`;
      }
      let isMatched = false;
      if (this.type === 'mastered') {
        isMatched = masteryStore.isMastered(key);
      } else {
        isMatched = masteryStore.isIgnored(key);
      }
      if (isMatched) {
        const lower = card.word.toLowerCase();
        if (!wordMap.has(lower)) {
          wordMap.set(lower, card.word);
        }
      }
    }

    if (wordMap.size === 0) {
      const label = this.type === 'mastered' ? t("export_mastered") : t("export_ignored");
      new Notice(t("export_simple_no_words", label));
      return;
    }

    const wordList = Array.from(wordMap.values());
    wordList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    const content = wordList.join('\n');

    // 写入文件
    const existing = this.app.vault.getAbstractFileByPath(fullPath);
    if (existing) {
      const confirmed = confirm(t("export_simple_file_exist"));
      if (!confirmed) return;
      await this.app.vault.modify(existing, content);
    } else {
      if (this.selectedFolder) {
        const dir = this.app.vault.getAbstractFileByPath(this.selectedFolder);
        if (!dir) {
          await this.app.vault.createFolder(this.selectedFolder);
        }
      }
      await this.app.vault.create(fullPath, content);
    }

    new Notice(t("export_simple_success", wordMap.size, fullPath));
    this.close();
  }
}

// ========== 添加/编辑语言映射模态窗 ==========
class LanguageModal extends Modal {
  constructor(app, plugin, existingLang = null, onSaveCallback = null) {
    super(app);
    this.plugin = plugin;
    this.existingLang = existingLang;
    this.onSaveCallback = onSaveCallback;
    this.isEditing = !!existingLang;
    this.displayName = existingLang?.displayName || '';
    this.standardCode = existingLang?.standardCode || '';
    this.presetCodes = existingLang?.presetCodes ? { ...existingLang.presetCodes } : { google: '', baidu: '', system: '', custom: '' };
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.titleEl.setText(t('language_edit_title'));

    // --- 保存显示名称输入框引用 ---
    let nameInputEl = null;

    // 显示名称
    new Setting(contentEl)
      .setName(t('language_display_name'))
      .addText(text => {
        text.setValue(this.displayName);
        text.onChange(val => this.displayName = val);
        nameInputEl = text.inputEl;  // 保存引用
        return text;
      });

    // 标准代码（下拉+手动输入）
    const codeSetting = new Setting(contentEl)
      .setName(t('language_standard_code'))
      .setDesc(t('language_code_desc'));

    let codeInputEl = null;
    codeSetting.addText(text => {
      text.setValue(this.standardCode);
      text.onChange(val => this.standardCode = val);
      codeInputEl = text.inputEl;
      return text;
    });
    // 编辑模式下禁用标准代码框
    if (this.isEditing && codeInputEl) {
      codeInputEl.disabled = true;
      codeInputEl.style.color = 'var(--text-muted)';
      codeInputEl.style.opacity = '0.7';
      // 编辑时不需要 datalist 提示
      codeInputEl.removeAttribute('list');
    }

    // 创建 datalist
    const datalist = document.createElement('datalist');
    datalist.id = 'lang-code-list';
    const builtinCodes = BUILTIN_LANGUAGES.map(l => l.standardCode);
    builtinCodes.forEach(code => {
      const option = document.createElement('option');
      option.value = code;
      datalist.appendChild(option);
    });
    contentEl.appendChild(datalist);

    // 安全设置 list 属性
    if (codeInputEl) {
      codeInputEl.setAttribute('list', 'lang-code-list');
    }

    // --- 预设代码区域 ---
    contentEl.createEl('hr');
    contentEl.createEl('h4', { text: t('language_preset_codes') });

    const presetLabels = [t('preset_google'), t('preset_baidu'), t('preset_system'), t('preset_custom')];
    const presetKeys = ['google', 'baidu', 'system', 'custom'];
    this.presetInputs = {};  // 存储预设输入框引用

    for (let i = 0; i < presetKeys.length; i++) {
      const key = presetKeys[i];
      const setting = new Setting(contentEl)
        .setName(t(presetLabels[i]));

      let inputEl = null;
      setting.addText(text => {
        text.setValue(this.presetCodes[key] || '');
        text.onChange(val => this.presetCodes[key] = val);
        inputEl = text.inputEl;
        return text;
      });
      // 保存引用
      this.presetInputs[key] = inputEl;

      setting.addButton(btn => {
        btn.setButtonText('↺');
        btn.setTooltip(t('language_reset_default'));
        btn.onClick(() => {
          const builtin = BUILTIN_LANGUAGES.find(l => l.standardCode === this.standardCode);
          if (builtin && builtin.presetCodes && builtin.presetCodes[key]) {
            this.presetCodes[key] = builtin.presetCodes[key];
          } else {
            this.presetCodes[key] = this.standardCode;
          }
          if (this.presetInputs[key]) {
            this.presetInputs[key].value = this.presetCodes[key];
          }
        });
        return btn;
      });
    }

    // --- 标准代码 change 事件（自动填充） ---
    if (codeInputEl) {
      codeInputEl.addEventListener('change', () => {
        const code = codeInputEl.value.trim();
        const selected = BUILTIN_LANGUAGES.find(l => l.standardCode === code);
        if (selected) {
          // 更新显示名称
          this.displayName = selected.displayName;
          if (nameInputEl) nameInputEl.value = this.displayName;

          // 更新预设代码
          this.presetCodes = {
            google: selected.presetCodes.google || code,
            baidu: selected.presetCodes.baidu || code,
            system: selected.presetCodes.system || code,
            custom: selected.presetCodes.custom || code
          };
          // 更新预设输入框的值
          for (const key of presetKeys) {
            if (this.presetInputs[key]) {
              this.presetInputs[key].value = this.presetCodes[key];
            }
          }
        } else {
          // 未匹配到内置语言，清空显示名称和预设代码（让用户手动填写）
          this.displayName = '';
          if (nameInputEl) nameInputEl.value = '';
          this.presetCodes = { google: '', baidu: '', system: '', custom: '' };
          for (const key of presetKeys) {
            if (this.presetInputs[key]) {
              this.presetInputs[key].value = '';
            }
          }
        }
      });
    }

    // --- 底部按钮 ---
    const buttonDiv = contentEl.createDiv({ cls: 'modal-button-container' });
    buttonDiv.style.cssText = 'display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;';
    const cancelBtn = buttonDiv.createEl('button', { text: t('cancel') });
    cancelBtn.addEventListener('click', () => this.close());
    const saveBtn = buttonDiv.createEl('button', { text: t('save'), cls: 'mod-cta' });
    saveBtn.addEventListener('click', () => this.save());
  }

  async save() {
    const displayName = this.displayName.trim();
    const standardCode = this.standardCode.trim();
    if (!displayName || !standardCode) {
      new Notice(t('language_fill_required'));
      return;
    }
    const duplicate = this.plugin.settings.languages.some(l =>
      l.standardCode === standardCode && (this.isEditing ? l.standardCode !== this.existingLang.standardCode : true)
    );
    if (duplicate) {
      new Notice(t('language_code_exists'));
      return;
    }

    const langEntry = {
      id: standardCode,
      displayName: displayName,
      standardCode: standardCode,
      presetCodes: {
        google: this.presetCodes.google || standardCode,
        baidu: this.presetCodes.baidu || standardCode,
        system: this.presetCodes.system || standardCode,
        custom: this.presetCodes.custom || standardCode
      }
    };

    if (this.isEditing) {
      const idx = this.plugin.settings.languages.findIndex(l => l.standardCode === this.existingLang.standardCode);
      if (idx !== -1) {
        this.plugin.settings.languages[idx] = langEntry;
      }
    } else {
      this.plugin.settings.languages.push(langEntry);
    }

    await this.plugin.saveSettings();
    if (this.onSaveCallback) this.onSaveCallback();
    this.close();
    new Notice(this.isEditing ? t('language_updated') : t('language_added'));
  }
}

// ========== 单词卡片右键菜单 ==========
class WordContextMenu {
  constructor(plugin, wordObj) { this.plugin = plugin; this.wordObj = wordObj; }

  showAtMouseEvent(e) {
    const menu = new (require('obsidian').Menu)();
    const fileSetting = this.plugin.settings.wordbookFiles.find(f => f.path === this.wordObj.sourceFile);
    const isReadonly = fileSetting ? fileSetting.readonly : false;

    // 编辑和删除仅在非只读时显示
    if (!isReadonly) {
      menu.addItem(item => item.setTitle(t("edit")).setIcon("pencil").onClick(() => this.editWord()));
      menu.addItem(item => item.setTitle(t("delete")).setIcon("trash").onClick(() => this.deleteWord()));
    }

    // 始终显示“导出为 Markdown”（不依赖只读状态）
    menu.addItem(item =>
      item.setTitle(t("export_single_card"))
        .setIcon("file-down")
        .onClick(() => this.exportWord())
    );

    if (menu.items.length > 0) {
      menu.showAtMouseEvent(e);
    }
  }

  // 导出单卡片的方法
  async exportWord() {
    new ExportSingleWordModal(this.plugin.app, this.plugin, this.wordObj).open();
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

// ========== 单词右键复制菜单 ==========
class WordCopyMenu {
  constructor(plugin, wordObj) {
    this.plugin = plugin;
    this.wordObj = wordObj;
  }

  showAtMouseEvent(e) {
    const menu = new (require('obsidian').Menu)();
    const card = this.wordObj;

    // 复制单词
    menu.addItem(item => item
      .setTitle(t("library_copy_word"))
      .setIcon('copy')
      .onClick(() => {
        navigator.clipboard.writeText(card.word);
      })
    );

    // 复制音标
    menu.addItem(item => item
      .setTitle(t("library_copy_phonetic"))
      .setIcon('copy')
      .onClick(() => {
        navigator.clipboard.writeText(card.phonetic || '');
      })
    );

    // 复制释义
    menu.addItem(item => item
      .setTitle(t("library_copy_definition"))
      .setIcon('copy')
      .onClick(() => {
        navigator.clipboard.writeText(card.definition || '');
      })
    );

    // 复制来源
    menu.addItem(item => item
      .setTitle(t("library_copy_source"))
      .setIcon('copy')
      .onClick(() => {
        navigator.clipboard.writeText(card.sourceFile);
      })
    );

    // 复制全部信息
    menu.addItem(item => item
      .setTitle(t("library_copy_all"))
      .setIcon('copy')
      .onClick(() => {
        const allInfo = [
          `**${t("copy_all_word")}** ${card.word}`,
          `**${t("copy_all_phonetic")}** ${card.phonetic || ''}`,
          `**${t("copy_all_source")}** ${card.sourceFile}`,
          `**${t("copy_all_definition")}**\n${card.definition || ''}`
        ].join('\n');
        navigator.clipboard.writeText(allInfo);
      })
    );

    menu.showAtPosition({ x: e.clientX, y: e.clientY });
  }
}

// ========== 主插件类 ==========
class SimpleWordbookPlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    // 启动时检测 SecretStorage 可用性
    const hasSecretStorage = typeof this.app.secretStorage?.getSecret === 'function';
    this._hasSecretStorage = hasSecretStorage;  // 供 UI 使用

    if (!hasSecretStorage && this.settings.api?.mode === "secret_storage") {
      let plaintext = "";
      const oldName = this.settings.api.secretName;
      if (oldName) {
        try {
          plaintext = await this.app.secretStorage.getSecret(oldName) || "";
        } catch (e) { }
      }
      this.settings.api.mode = "local_encrypted";
      if (plaintext) {
        const salt = generateSalt();
        const ciphertext = await encryptApiKey(this.app, plaintext, salt);
        this.settings.api.encryptedData = { ciphertext, salt };
        this.settings.api.secretName = "";
        new Notice(t("notice_api_migrated"));
      } else {
        this.settings.api.encryptedData = null;
        this.settings.api.secretName = "";
        new Notice(t("notice_secret_storage_unavailable"));
      }
      await this.saveSettings();
    }

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
    // 初始化学习进度存储
    this.studyStore = new StudyStore(this);
    await this.studyStore.load();
    this.highlighter = new Highlighter(this);
    this.hoverPreview = new HoverPreview(this);

    this.sidebarTrie = new WordTrie();

    this.registerView(VIEW_TYPE_SIDEBAR, (leaf) => new SidebarView(leaf, this));
    this.registerView(VIEW_TYPE_LOOKUP, (leaf) => new LookupView(leaf, this));
    this.registerView(VIEW_TYPE_LIBRARY, (leaf) => new LibraryView(leaf, this)); // 注册词库管理视图
    this.addRibbonIcon("notepad-text", t("sidebar_title"), () => this.activateSidebar());
    this.addRibbonIcon("book-search", t("lookup_view_title"), () => {
      const leaf = this.getLookupLeaf();
      this.app.workspace.revealLeaf(leaf);
    });
    this.addRibbonIcon("library-big", t("ribbon_library_tooltip"), () => this.activateLibrary());
    // 注册学习中心视图
    this.registerView(VIEW_TYPE_STUDY, (leaf) => new StudyView(leaf, this));
    this.addRibbonIcon("target", t("study_ribbon_tooltip"), () => this.activateStudy());
    this.addCommand({
      id: "open-study",
      name: t("study_command_open"),
      callback: () => this.activateStudy()
    });

    this.addCommand({ id: "open-sidebar", name: t("sidebar_title"), callback: () => this.activateSidebar() });
    this.addCommand({
      id: "add-word",
      name: t("add_word_title"),
      callback: () => {
        const selected = this.getSelectedText();
        new WordModal(this.app, this, { word: selected || "" }).open();
      }
    });
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
    // ===== 打开查词面板 =====
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

    // ===== 打开词库管理 =====
    this.addCommand({
      id: "open-library",
      name: t("command_open_library"),
      callback: () => this.activateLibrary()
    });

    // ===== 朗读选中的文本 =====
    this.addCommand({
      id: 'pronounce-selected-text',
      name: t("command_pronounce_selected"),
      callback: () => this.pronounceSelectedText()
    });

    this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor) => {
      const selected = editor.getSelection().trim();
      if (selected) {
        menu.addItem(item => item.setTitle(t("add_word_title")).setIcon("plus").onClick(() => new WordModal(this.app, this, { word: selected }).open()));
      }

      // 查词功能（如果选中文本）
      if (selected) {
        // 截断显示：超过20个字符截断并加 …
        const displayText = selected.length > 20 ? selected.slice(0, 20) + '…' : selected;
        const submenu = menu.addItem(item => {
          item.setTitle(t("editor_menu_lookup", displayText)).setIcon("book-search");
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

    // 监听文件重命名/移动，自动更新单词本路径
    this.registerEvent(this.app.vault.on("rename", async (file, oldPath) => {
      // 只处理 JSON 文件
      if (!(file instanceof TFile) || file.extension !== "json") return;

      let found = false;
      for (const dict of this.settings.wordbookFiles) {
        if (dict.path === oldPath) {
          dict.path = file.path;
          dict.name = file.basename;  // 同步更新显示名称
          found = true;
          break;
        }
      }

      if (found) {
        await this.saveSettings();
        await this.reloadAllCards(false);
        await this.highlighter.refresh();
        this.app.workspace.trigger("simple-wordbook:data-updated");
        new Notice(t("rename_success", file.name));
      }
    }));

    // ===== 注册自定义提示词命令 =====
    this.registerPromptCommands();
  }
  
  async onunload() {
    // 1. 先断开所有监听，防止在清除过程中重新添加高亮
    if (this.highlighter) {
      this.highlighter.cleanupPDFListeners?.();
      // 2. 然后清除所有高亮元素
      await this.highlighter.clearAllHighlights();
    }

    // 3. 销毁悬停预览（移除残留的提示框）
    if (this.hoverPreview) {
      this.hoverPreview.destroy();
    }

    // 4. 注销所有动态提示词命令
    for (const id of this.dynamicCommandIds) {
      this.removeCommand(id);
    }
    this.dynamicCommandIds = [];
  }

  // ===== 获取 API Key（支持两种模式） =====
  async getApiKeyPlaintext() {
    const api = this.settings.api || { mode: "secret_storage" };

    if (api.mode === "secret_storage") {
      const name = api.secretName || "";
      if (!name) return "";
      try {
        return await this.app.secretStorage.getSecret(name) || "";
      } catch {
        return "";
      }
    }

    if (api.mode === "local_encrypted") {
      const encrypted = api.encryptedData;
      if (!encrypted || !encrypted.ciphertext) return "";
      return await decryptApiKey(this.app, encrypted.ciphertext, encrypted.salt || "");
    }

    return "";
  }

  // 调用 AI API
  async callAI(prompt, systemContent = null) {
    const settings = this.settings;
    const url = settings.apiBaseUrl;
    const apiKey = await this.getApiKeyPlaintext();
    const model = settings.apiModel;

    // 参数校验
    if (!url || !apiKey) {
      throw new Error(t("api_error_config"));
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    };

    const messages = [];
    if (systemContent && systemContent.trim()) {
      messages.push({ role: "system", content: systemContent });
    }
    messages.push({ role: "user", content: prompt });

    const body = {
      model: model,
      messages: messages,
      temperature: 0.5,
      max_tokens: 1500
    };

    let response;
    try {
      // 将 fetch 放在 try-catch 中，单独捕获网络层错误
      response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });
    } catch (networkError) {
      // 网络层错误（DNS 解析失败、连接拒绝、超时等）
      console.error("Network error:", networkError);
      throw new Error(t("api_error_network"));
    }

    // HTTP 状态错误单独处理，显示状态码
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = "";
      }
      // 支持参数插值
      throw new Error(t("api_error_http", response.status, errorText));
    }

    // 解析响应数据，增加更详细的错误提示
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

    // 最后回退到创建新标签页
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

    // 根目录通配符 *
    const hasRootWildcard = scopePaths.includes('*');
    if (hasRootWildcard) {
      const isRootFile = !normalizedPath.includes('/');
      if (isRootFile) {
        return scopeMode === "include";
      }
    }

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

  async activateLibrary() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_LIBRARY)[0];
    if (!leaf) {
      leaf = workspace.getLeaf('tab');
      await leaf.setViewState({ type: VIEW_TYPE_LIBRARY, active: true });
    }
    workspace.revealLeaf(leaf);
  }

  // ----- 激活学习中心视图 -----
  async activateStudy() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_STUDY)[0];
    if (!leaf) {
      leaf = workspace.getLeaf('tab');
      await leaf.setViewState({ type: VIEW_TYPE_STUDY, active: true });
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
      let displayPromptName = promptName;
      if (promptName === '默认') {
        displayPromptName = t("lookup_default_prompt_option");
      }
      const name = t("command_lookup_prompt", displayPromptName);

      this.addCommand({
        id: id,
        name: name,
        callback: () => {
          // 使用统一方法获取选中文本
          const selected = this.getSelectedText();
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

  // 统一获取选中文本（编辑模式优先，阅读模式fallback）
  getSelectedText() {
    // 1. 优先从活动编辑器获取（编辑模式）
    const activeEditor = this.app.workspace.activeEditor;
    if (activeEditor && activeEditor.editor) {
      const selection = activeEditor.editor.getSelection();
      if (selection && selection.trim()) return selection.trim();
    }
    // 2. 从阅读模式的 DOM 选中获取
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const text = selection.toString();
      if (text && text.trim()) return text.trim();
    }
    return null;
  }

  // ===== 获取单词所在的段落/句子/列表项 =====
  getSelectedSentence(mode = 'paragraph', targetWord = null) {
    // 编辑模式（CodeMirror）
    const activeEditor = this.app.workspace.activeEditor;
    if (!activeEditor || !activeEditor.editor) {
      return '';
    }

    const editor = activeEditor.editor;
    const cursor = editor.getCursor('from');
    const lineCount = editor.lineCount();

    // ---- 工具函数：判断行是否为 Markdown 块 ----
    const isMarkdownBlock = (lineText) => {
      const trimmed = lineText.trim();
      if (!trimmed) return false;
      return /^(\s*[-*+]\s|\s*\d+\.\s|#{1,6}\s|```|>\s|---|\*\*\*|___|\[TOC\])/.test(trimmed);
    };

    // ---- 工具函数：按句子切分 ----
    const splitIntoSentences = (text) => {
      if (!text) return [];
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        try {
          // 直接检测整个段落文本识别文本语言（标点符号 + 字符范围）
          const isCJK = /[。！？]/.test(text) || /[\u4e00-\u9fff\u3040-\u30FF\uAC00-\uD7AF]/.test(text);
          const langKey = isCJK ? 'zh' : 'en';
          const segmenter = new Intl.Segmenter(langKey, { granularity: 'sentence' });
          const segments = segmenter.segment(text);
          const result = [];
          for (const seg of segments) {
            const sentence = seg.segment.trim();
            if (sentence) result.push(sentence);
          }
          return result;
        } catch (e) { /* fallback */ }
      }
      // 降级方案：按常见标点切分，保留最后一个无标点的句子
      const matches = text.match(/[^。！？.!?]+[。！？.!?]+|[^。！？.!?]+$/g);
      return matches ? matches.map(s => s.trim()).filter(s => s) : [text.trim()];
    };

    // ---- 按空行划定上下文（光标所在的完整段落） ----
    let paraStart = cursor.line;
    let paraEnd = cursor.line;

    // 向上找空行
    for (let i = cursor.line - 1; i >= 0; i--) {
      if (editor.getLine(i).trim() === '') break;
      paraStart = i;
    }
    // 向下找空行
    for (let i = cursor.line + 1; i < lineCount; i++) {
      if (editor.getLine(i).trim() === '') break;
      paraEnd = i;
    }

    // 提取整个段落的文本和各行数组
    const paragraphLines = [];
    let paragraphText = '';
    for (let i = paraStart; i <= paraEnd; i++) {
      const line = editor.getLine(i);
      paragraphLines.push(line);
      paragraphText += line + '\n';
    }
    paragraphText = paragraphText.trim();

    if (!paragraphText) return '';

    // ---- 模式分发 ----
    // 按空行分隔（直接返回整个段落）
    if (mode === 'paragraph') {
      return paragraphText;
    }

    // 按换行分隔（在段落内取光标所在的行）
    if (mode === 'line') {
      const currentLine = editor.getLine(cursor.line);
      // 如果当前行是 Markdown 块，在段落内找最近的普通正文行
      if (isMarkdownBlock(currentLine)) {
        // 在段落范围内查找
        for (let i = cursor.line - 1; i >= paraStart; i--) {
          const line = editor.getLine(i);
          if (!isMarkdownBlock(line) && line.trim()) {
            return line.trim();
          }
        }
        for (let i = cursor.line + 1; i <= paraEnd; i++) {
          const line = editor.getLine(i);
          if (!isMarkdownBlock(line) && line.trim()) {
            return line.trim();
          }
        }
        return '';
      }
      return currentLine.trim();
    }

    // 按句子边界（在段落内提取光标所在的句子）
    if (mode === 'sentence') {
      const sentences = splitIntoSentences(paragraphText);
      if (sentences.length === 0) return '';

      // 计算光标在段落文本中的字符位置
      let charPos = 0;
      for (let i = paraStart; i < cursor.line; i++) {
        charPos += editor.getLine(i).length + 1;
      }
      charPos += cursor.ch;

      // 找到光标所在的句子
      let currentSentenceIndex = 0;
      let accumulatedLength = 0;
      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i];
        const sentenceStart = paragraphText.indexOf(sentence, accumulatedLength);
        if (sentenceStart === -1) {
          accumulatedLength += sentence.length + 1;
          continue;
        }
        const sentenceEnd = sentenceStart + sentence.length;
        if (charPos >= sentenceStart && charPos <= sentenceEnd) {
          currentSentenceIndex = i;
          break;
        }
        accumulatedLength = sentenceEnd;
      }

      const currentSentence = sentences[currentSentenceIndex] || sentences[0];

      // 检查目标词
      if (targetWord && targetWord.trim()) {
        const lowerTarget = targetWord.toLowerCase();
        // 当前句子包含目标词，直接返回
        if (currentSentence.toLowerCase().includes(lowerTarget)) {
          return currentSentence;
        }
        // 向前查找
        for (let i = currentSentenceIndex - 1; i >= 0; i--) {
          if (sentences[i].toLowerCase().includes(lowerTarget)) {
            return sentences[i];
          }
        }
        // 向后查找
        for (let i = currentSentenceIndex + 1; i < sentences.length; i++) {
          if (sentences[i].toLowerCase().includes(lowerTarget)) {
            return sentences[i];
          }
        }
      }

      // 回退到光标所在的句子
      return currentSentence || sentences[0] || '';
    }

    // 按列表项（在段落内提取光标所在的列表项）
    if (mode === 'list') {
      const currentLine = editor.getLine(cursor.line);
      const listItemRegex = /^\s*[-*+]\s|\s*\d+\.\s/;

      // 在段落内查找列表项
      let targetLine = cursor.line;
      let found = false;

      if (listItemRegex.test(currentLine.trim())) {
        // 当前行就是列表项
        targetLine = cursor.line;
        found = true;
      } else {
        // 在段落范围内向上查找
        for (let i = cursor.line - 1; i >= paraStart; i--) {
          const line = editor.getLine(i);
          if (listItemRegex.test(line.trim())) {
            targetLine = i;
            found = true;
            break;
          }
        }
        if (!found) {
          // 向下查找
          for (let i = cursor.line + 1; i <= paraEnd; i++) {
            const line = editor.getLine(i);
            if (listItemRegex.test(line.trim())) {
              targetLine = i;
              found = true;
              break;
            }
          }
        }
      }

      if (!found) return '';

      // 提取列表项（含缩进子项）
      const targetLineText = editor.getLine(targetLine);
      const indent = targetLineText.match(/^\s*/)[0];
      const currentIndent = indent.length;
      let result = targetLineText.trim();

      // 向下收集缩进更大的子项（限制在段落范围内）
      for (let i = targetLine + 1; i <= paraEnd; i++) {
        const line = editor.getLine(i);
        const lineIndent = line.match(/^\s*/)[0].length;
        if (lineIndent <= currentIndent && line.trim()) break;
        if (lineIndent > currentIndent && line.trim()) {
          result += '\n' + line.trim();
        }
      }

      return result;
    }

    return '';
  }

  // ===== 朗读选中的文本 =====
  async pronounceSelectedText() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      new Notice(t("notice_select_word"));
      return;
    }
    const text = selection.toString().trim();

    let lang = null;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let node = range.startContainer;
      while (node && node.nodeType !== Node.DOCUMENT_NODE) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node;
          const container = el.closest?.('.word-card, .simple-wordbook-tooltip');
          if (container) {
            lang = container.dataset.lang || null;
            break;
          }
        }
        node = node.parentNode;
      }
    }

    if (!lang) {
      lang = this.settings.defaultLanguage || 'en';
    }

    try {
      await playPronunciation(
        text,
        this.settings.ttsUrlTemplate,
        this.settings.pronunciationVariant,
        lang
      );
    } catch (e) {
      console.warn('Pronunciation failed:', e);
      new Notice(t("notice_tts_playback_failed"));
    }
  }

  // ===== 打开快捷键设置并过滤本插件命令 =====
  async openHotkeysSettings() {
    await this.app.setting.open();
    const hotkeysTab = await this.app.setting.openTabById('hotkeys');
    // 尝试这个设置查询参数是否支持
    if (hotkeysTab && typeof hotkeysTab.setQuery === 'function') {
      hotkeysTab.setQuery(this.manifest.id);
    }
  }

  async loadSettings() { 
    const rawData = await this.loadData();  // 先获取原始数据
    this.settings = Object.assign({}, DEFAULT_SETTINGS, rawData);
    let needsSave = false;  // 添加保存标志

    // 确保插件语言设置有默认值
    if (this.settings.pluginLanguage === undefined) {
      this.settings.pluginLanguage = "auto";
    }

    // 确保 studyParams 存在
    if (!this.settings.studyParams) {
      this.settings.studyParams = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.studyParams));
    }

    // 迁移复习排序设置：将旧的 "level_first" 映射到 "level_high_first"
    if (this.settings.study && this.settings.study.reviewOrder === 'level_first') {
      this.settings.study.reviewOrder = 'level_high_first';
      needsSave = true;
    }
    // 确保 selectedWordbook 字段存在（兼容旧数据）
    if (this.settings.study && !this.settings.study.hasOwnProperty('selectedWordbook')) {
      this.settings.study.selectedWordbook = "all";
      needsSave = true;
    }
    // 确保 intervalDays 字段存在（兼容旧数据）
    if (!this.settings.study.intervalDays || this.settings.study.intervalDays.length !== 5) {
      this.settings.study.intervalDays = [1, 2, 4, 8, 16];
      needsSave = true;
    }

    // 兼容旧设置
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
    // 自定义颜色字段兼容
    if (this.settings.customHighlightColor === undefined) {
      this.settings.customHighlightColor = "";
    }

    // 发音设置字段初始化
    if (this.settings.defaultLanguage === undefined) {
      this.settings.defaultLanguage = "en";
    }
    // 初始化语言列表
    if (!this.settings.languages || this.settings.languages.length === 0) {
      // 语言列表为空时，使用完整的内置语言列表
      this.settings.languages = JSON.parse(JSON.stringify(BUILTIN_LANGUAGES));
    }

    // 检查 defaultLanguage 是否存在于语言列表中，若不存在则添加该语言（使用标准代码作为显示名称）
    const defaultLangExists = this.settings.languages.some(l => l.standardCode === this.settings.defaultLanguage);
    if (!defaultLangExists) {
      const newLang = {
        id: this.settings.defaultLanguage,
        displayName: this.settings.defaultLanguage,
        standardCode: this.settings.defaultLanguage,
        presetCodes: { google: this.settings.defaultLanguage, baidu: this.settings.defaultLanguage, system: this.settings.defaultLanguage, custom: this.settings.defaultLanguage },
      };
      this.settings.languages.push(newLang);
    }

    // 确保 en 语言始终存在（防呆）
    if (!this.settings.languages.some(l => l.standardCode === 'en')) {
      const enLang = BUILTIN_LANGUAGES.find(l => l.standardCode === 'en');
      if (enLang) {
        this.settings.languages.push({ ...enLang });
        // 如果默认语言不存在或为空，也重置为 en
        if (!this.settings.languages.some(l => l.standardCode === this.settings.defaultLanguage)) {
          this.settings.defaultLanguage = 'en';
        }
      }
    }

    // 确保 defaultLanguage 始终指向一个存在的语言 en
    if (!this.settings.languages.some(l => l.standardCode === this.settings.defaultLanguage)) {
      this.settings.defaultLanguage = 'en';
    }

    // 网络 TTS预设值初始化
    if (this.settings.ttsPreset === undefined) {
      this.settings.ttsPreset = "youdao";
    }
    // 确保 customTtsUrlTemplate 存在
    if (this.settings.customTtsUrlTemplate === undefined) {
      this.settings.customTtsUrlTemplate = "";
    }

    // 系统 TTS 字段初始化
    if (this.settings.systemTTSSpeechRate === undefined) this.settings.systemTTSSpeechRate = 1.0;
    if (this.settings.systemTTSPitch === undefined) this.settings.systemTTSPitch = 1.0;
    if (this.settings.systemTTSVoiceName === undefined) this.settings.systemTTSVoiceName = "";

    // 系统提示词兼容
    if (!this.settings.systemPrompts) this.settings.systemPrompts = [];

    if (!rawData || !rawData.hasOwnProperty('defaultSystemPrompt')) {
      const keys = getBuiltinPromptKeys();
      this.settings.defaultSystemPrompt = keys.length > 0 ? "builtin_" + keys[0] : "";
    }
    if (this.settings.customPrompts) {
      const keys = getBuiltinPromptKeys();
      const defaultBuiltinKey = keys.length > 0 ? "builtin_" + keys[0] : "";
      for (const p of this.settings.customPrompts) {
        if (p.system_prompt === undefined) {
          p.system_prompt = defaultBuiltinKey;
        }
      }
    }

    // 迁移：旧明文 → 本地加密
    const hasLegacyPlaintext =
      rawData?.apiKey &&
      typeof rawData.apiKey === 'string' &&
      rawData.apiKey.length > 0;

    const hasExistingEncrypted =
      this.settings.api?.encryptedData?.ciphertext;

    if (hasLegacyPlaintext && !hasExistingEncrypted) {
      const plaintext = rawData.apiKey;
      const salt = generateSalt();
      const ciphertext = await encryptApiKey(this.app, plaintext, salt);

      if (!this.settings.api) this.settings.api = { mode: "local_encrypted", secretName: "", encryptedData: null };
      this.settings.api.mode = "local_encrypted";
      this.settings.api.encryptedData = { ciphertext, salt };
      this.settings.api.secretName = "";

      delete this.settings.apiKey;
      await this.saveSettings();
      new Notice(t("notice_api_migrated"));
    }

    // 确保 api 结构存在
    if (!this.settings.api) {
      this.settings.api = { mode: "secret_storage", secretName: "", encryptedData: null };
    }

    // 如果 mode 非法，修正为默认
    if (!this.settings.api.mode ||
      (this.settings.api.mode !== "secret_storage" && this.settings.api.mode !== "local_encrypted")) {
      this.settings.api.mode = "secret_storage";
    }

    // 如果有需要保存的迁移，执行保存
    if (needsSave) {
      await this.saveSettings();
    }
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

// ========== 密钥迁移确认模态框 ==========
class MigrationConfirmModal extends Modal {
  constructor(app, targetMode, onConfirm) {
    super(app);
    this.targetMode = targetMode;
    this.onConfirm = onConfirm;
    this.keyName = "simple-wordbook_api_key";
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    const modeLabel = this.targetMode === "secret_storage"
      ? t("settings_api_key_mode_secret")
      : t("settings_api_key_mode_local");
    this.titleEl.setText(t("settings_api_key_migrate_title", modeLabel));

    contentEl.createEl("p", { text: t("settings_api_key_migrate_desc") });

    // 密钥名称输入框（仅在切换到 secret_storage 时显示）
    if (this.targetMode === "secret_storage") {
      new Setting(contentEl)
        .setName(t("settings_api_key_new_name"))
        .setDesc(t("settings_api_key_new_name_desc"))
        .addText(text => {
          text.setValue("simple-wordbook-api-key");
          text.inputEl.style.width = "100%";
          text.onChange(val => {
            // 实时清理
            const cleaned = sanitizeSecretName(val);
            // 更新输入框显示清理后的值
            if (val !== cleaned) {
              text.setValue(cleaned);
            }
            this.keyName = cleaned || "simple-wordbook-api-key";
          });
        }); 
    }

    const buttonDiv = contentEl.createDiv({ cls: "modal-button-container" });
    buttonDiv.style.cssText = "display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;";

    const skipBtn = buttonDiv.createEl("button", { text: t("settings_api_key_migrate_skip") });
    skipBtn.addEventListener("click", () => {
      this.close();
      this.onConfirm(false, "");
    });

    const migrateBtn = buttonDiv.createEl("button", {
      text: t("settings_api_key_migrate_confirm"),
      cls: "mod-cta"
    });
    migrateBtn.addEventListener("click", () => {
      const name = this.keyName;
      this.close();
      this.onConfirm(true, name);
    });
  }
}

module.exports = SimpleWordbookPlugin;
