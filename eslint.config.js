import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import * as parserVue from "vue-eslint-parser";
import configPrettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // 全局忽略文件配置
  globalIgnores([
    "**/.*", // 隐藏文件
    "dist/*", // 构建输出目录
    "*.d.ts", // TypeScript 类型定义文件
    "public/*", // 静态资源
    "src/assets/**", // 资源目录
    "src/**/iconfont/**" // 图标字体资源
  ]),
  {
    // 基础 JavaScript 配置
    ...js.configs.recommended,
    languageOptions: {
      // 全局变量声明（基于项目 types/index.d.ts）
      globals: {
        // types/index.d.ts
        RefType: "readonly",
        EmitType: "readonly",
        TargetContext: "readonly",
        ComponentRef: "readonly",
        ElRef: "readonly",
        ForDataType: "readonly",
        AnyFunction: "readonly",
        PropType: "readonly",
        Writable: "readonly",
        Nullable: "readonly",
        NonNullable: "readonly",
        Recordable: "readonly",
        ReadonlyRecordable: "readonly",
        Indexable: "readonly",
        DeepPartial: "readonly",
        Without: "readonly",
        Exclusive: "readonly",
        TimeoutHandle: "readonly",
        IntervalHandle: "readonly",
        Effect: "readonly",
        ChangeEvent: "readonly",
        WheelEvent: "readonly",
        ImportMetaEnv: "readonly",
        Fn: "readonly",
        PromiseFn: "readonly",
        ComponentElRef: "readonly",
        parseInt: "readonly",
        parseFloat: "readonly"
      }
    },
    plugins: {
      // 注册 Prettier 插件
      prettier: pluginPrettier
    },
    rules: {
      // 禁用冲突规则
      ...configPrettier.rules,
      // 推荐规则
      ...pluginPrettier.configs.recommended.rules,
      "no-debugger": "off", // 允许调试器
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto" // 行尾换行处理
        }
      ]
    }
  },
  ...tseslint.config({
    extends: [...tseslint.configs.recommended],
    files: ["**/*.?([cm])ts", "**/*.?([cm])tsx"],
    rules: {
      "@typescript-eslint/no-redeclare": "error", // 禁止重复声明
      "@typescript-eslint/ban-ts-comment": "off", // 允许 TS 注释
      "@typescript-eslint/no-explicit-any": "off", // 允许 any 类型
      "@typescript-eslint/prefer-as-const": "warn",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { disallowTypeAnnotations: false, fixStyle: "inline-type-imports" }
      ],
      "@typescript-eslint/prefer-literal-enum-member": [
        "error",
        { allowBitwiseExpressions: true }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ]
    }
  }),
  {
    files: ["**/*.d.ts"],
    rules: {
      "eslint-comments/no-unlimited-disable": "off",
      "import/no-duplicates": "off",
      "no-restricted-syntax": "off",
      "unused-imports/no-unused-vars": "off"
    }
  },
  {
    files: ["**/*.?([cm])js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      globals: {
        $: "readonly",
        $$: "readonly",
        $computed: "readonly",
        $customRef: "readonly",
        $ref: "readonly",
        $shallowRef: "readonly",
        $toRef: "readonly"
      },
      parser: parserVue,
      parserOptions: {
        ecmaFeatures: {
          jsx: false
        },
        extraFileExtensions: [".vue"],
        parser: tseslint.parser,
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      vue: pluginVue
    },
    processor: pluginVue.processors[".vue"],
    rules: {
      ...pluginVue.configs.base.rules,
      ...pluginVue.configs.essential.rules,
      ...pluginVue.configs.recommended.rules,
      "no-undef": "off",
      "no-unused-vars": "off",
      "vue/no-v-html": "off",
      "vue/require-default-prop": "off",
      "vue/require-explicit-emits": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-setup-props-reactivity-loss": "off",
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "always",
            component: "always"
          },
          svg: "always",
          math: "always"
        }
      ]
    }
  }
]);
