import Color from 'color';

// 亮度
function lightness(value, percent) {
  return Color(value).lightness(percent).hex();
}

export const palette = (colors) => {
  const {
    primary,
    secondary,
    tertiary,
    background,
    container,
    error,
    success,
  } = colors;

  const isDarkBackground = Color(background).isDark();
  const isDarkPrimary = Color(primary).isDark();

  // 文字的基准色为: 背景色翻转 + 灰度
  const onBackground = Color(background).negate().grayscale();
  const onContainer = Color(container).negate().grayscale();

  const white = '#FFFFFF';
  const black = '#000000';

  const res = {
    isDarkBackground,
    isDarkPrimary,
    // primary 按钮，主数据展示，强调内容
    primary,
    on_primary: isDarkPrimary ? white : black,

    // secondary 次级按钮 tabbar icon
    secondary,
    on_secondary: Color(secondary).isDark() ? white : black,

    // tertiary secondary的互补色 图标灰度圈
    tertiary,
    on_tertiary: Color(tertiary).isDark() ? white : black,

    // background 页面背景色
    background,
    on_background: onBackground.hex(),

    // container 容器卡片背景色
    container,
    container_a25: Color(container).alpha(0.25).string(),
    container_a50: Color(container).alpha(0.5).string(),
    container_a75: Color(container).alpha(0.75).string(),
    on_container: onContainer.hex(),
    on_container_a25: onContainer.alpha(0.25).string(),
    on_container_a50: onContainer.alpha(0.5).string(),
    on_container_a75: onContainer.alpha(0.75).string(),

    // text 文字颜色
    text: lightness(onBackground, isDarkBackground ? 85 : 15),
    text_light: lightness(onBackground, isDarkBackground ? 60 : 40),

    // error
    error,
    on_error: white,

    // success
    success,
  };
  return res;
};
