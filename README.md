<div align="center">

# 🐉 Project Kylin

> Scratch Project Obfuscator in one click.

[🇺🇸](./README.md) | [🇨🇳](./README_zh-CN.md) | [🇯🇵](./README_ja-JP.md)

</div>

Kylin is the first-ever obfuscator for Scratch (Turbowarp) that enables you to _encrypt_ your project, preventing it from being stolen or hacked.

It is extremely useful for packagers.

## Available features

- Classical obfuscation. Mangles variables, lists and procedures, and then make them invisible.
- Precompilation. Compiles entire project into uglified Javascript (terser), to make it impossible to recover (**may cause 10% performance decrease**). This obfuscation method is incompatible with some advanced extensions, such as `lpp`.
- Project signature. Adds an invisible "watermark" to your project to let you track them.

## How to use

After opening the project, navigate to `Custom Extension`, and install the extension from `https://furryr.github.io/kylin-extension/kylin.js`. Make sure `Run without sandbox` is checked.

If the project is already obfuscated, you can view the project's metadata. Otherwise, you will be able to adjust obfuscation preferences. When everything is ready, click `Proceed` and Kylin will automatically load the obfuscated version into your editor.

**Once you clicked `Proceed` you will not be able to restore your project. Keep that in mind.**

## I lost my project! Are there any ways to recover?

**SAVE BEFORE CLICKING PROCEED!!!**

Unlike the packager, you cannot recover your project after obfuscation. If you lost your source project, please do not bother the developers.

## Localization support

Available languages:

- English (United States)
- Japanese (Japan)
- Simplified Chinese (China)

## License and Copyright

AGPL-3.0-only. Powered by Turbowarp compiler. Authored by FurryR, inspired by VeroFess. the name `Kylin` comes from one of my friends, `@F_Qilin` (https://x.com/F_Qilin) aka CyanKylin.

### About [fair use](https://en.wikipedia.org/wiki/Fair_use)

Although this project is licensed under AGPL-3.0-only, the compiled project itself and bundled `Kylin runtime` are not. You can use the compiled code and runtime in any **personal** projects, including commercial ones, without any restrictions. In this case it is treated as _Fair use_. However, modifying the `Kylin runtime` or redistributing or republishing it as a separate product requires compliance with the open source license. Corporate use does not fall under fair use and is prohibited under the license agreement.

If you meet the above fair use conditions and are willing, it would be great if you indicate that you used Kylin in your project. This can help more people learn about Kylin. Thank you!
