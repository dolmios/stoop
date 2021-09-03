# stoop [![npm version](https://badge.fury.io/js/stoop.svg)](https://badge.fury.io/js/stoop)

Foundational styling for static sites. Stoop is intentionally limited, providing just enough at the core to keep _(lightweight)_ static sites inline with our development practices.

&nbsp;

![Stoop Kid: Its the greatest stoop I have ever seen. Arnold: Well, it's just one of the great stoops out there. And if you want to see em, all you have to do is take that one big step off your stoop.](https://mtv.mtvnimages.com/uri/mgid:ao:image:mtv.com:205384)

**\*Stoop Kid:** Its the greatest stoop I have ever seen. **Arnold:** Well, it's just one of the great stoops out there. And if you want to see em, all you have to do is take that one big step off your stoop.\*
&nbsp;

## Usage

Install Stoop from https://yarnpkg.com/package/stoop

    yarn add stoop

Now, simply setup a sass import stylesheet in your project folder. We suggest the following:

    @import "~stoop/src/app.scss";

You could use Stoop in it's compiled css form, however that isn't the intended use. Instead, import it to your `app.css` and you'll have access to all settings, mix-ins and utilities.

If you wish to override the default settings, you must define them in an `.scss` file before importing Stoop.

    // @import "settings.scss;
    @import "~stoop/src/app.scss;

Done. Enjoy. 🍷

## Settings

| Variables                                                        | Default                          | Use Case                                                                                                                                                                              |
| ---------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$type--parent`                                                  | system                           | Global font.                                                                                                                                                                          |
| `$type--line-height`                                             | `1.6`                            | Base line height for relative units.                                                                                                                                                  |
| `$type--baseline-size`                                           | `62.5%`                          | Base font size ☞ because 62.5% is equal to 10px in most browsers, so it makes it easier to calculate REM units.                                                                       |
| `$type--initial-size`                                            | `1.5rem`                         | Initial font size.                                                                                                                                                                    |
| `$color--light`                                                  | `#fff`                           | White, body background color.                                                                                                                                                         |
| `$color--dark`                                                   | `#000`                           | Black, body font color.                                                                                                                                                               |
| `$color--link`                                                   | `rgb(19, 19, 19)`                | Link color.                                                                                                                                                                           |
| `$set--transition`                                               | `all 0.17s ease-in-out`          | Transition speed for hovers.                                                                                                                                                          |
| `$space--1, $space--2, $space--3. $space--4, $space--5`          | `1rem, 3rem, 9rem, 12rem, 24rem` | Fixed spacing, for consistent padding and margins.                                                                                                                                    |
| `$break--1, $break--2, $break--3, $break--4`                     | `600px, 900px, 1200px, 1800px`   | Responsive breakpoints, nothing fancy here.                                                                                                                                           |
| `$width--phone, $width--tablet, $width--laptop, $width--desktop` | `95%, 95%, 128rem, 150rem`       | Max width for confined container for phone through desktop.                                                                                                                           |
| `$width--wide-a, $width--wide-b`                                 | `95%, 175rem`                    | Max width for confined container for ultrawides ☞ this sets a variable percentage based standard width and confines at a max width REM unit to cover a larger range of wide displays. |

&nbsp;

## Classes & Selectors

| Class                                                                           | Purpose                                                                                           |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `.outer`                                                                        | Full width outer container. No padding.                                                           |
| `.inner`                                                                        | Confined (max-width variable) inner container. Has horizontal padding.                            |
| `.no-inner`                                                                     | Adds horizontal padding to an outer div that doesn't have a corresponding inner. Keeps it pretty. |
| `.row`                                                                          | A row, holds columns                                                                              |
| `.row.align-top, .align-bottom, .align-center, .align-baseline, .align-stretch` | Align items for row. `flex-start, flex-end, center, baseline` respectively.                       |
| `.column` > then add size, eg `s-50` and add offset if needed, eg `o-25`        | 📱 Column, default 100% width unless `s-` added. Percentage based sizes.                          |
| `.hidden`                                                                       | 📱 Globally hide an element, or use on a screen size specific level.                              |
| `.visible`                                                                      | 📱 Shows a hidden element, probably on a screen size specific level.                              |
| `.type-r, .type-c, .type-l, .type-j`                                            | 📱 Text align `right, center, left, justify` respectively.                                        |
| `.type-i, .type-is`                                                             | 📱 Inline text positioning, with `.type-is` including horizontal padding (is = inline spaced).    |
| `.p-t-{size}` eg `.p-t-3`                                                       | 📱 Add padding top at an element level.                                                           |
| `.p-b-{size}` eg `.p-b-3`                                                       | 📱 Add padding bottom at an element level.                                                        |

### Responsive classes

Classes with the lil 📱 icon have screen size classes available. These are all as follows, column size used as an example -

    // .class-phone, .class-tablet, .class-laptop, .class-desktop, .class-wide
    .column.s-50-phone

### Column sizes and offsets

These sizes are also available for specific screen size breakpoints, and are identical to offsets (`s-10/o-10`).

    5, 10, 15, 20. 25. 30. 33, 35, 40. 50, 60. 65, 66, 70, 75, 80, 85, 90, 95

### Padding options

Either padding top or padding bottom. Used for responsive spacing for stacked columns mostly.

    0 = removes padding,
    1-h = ($space--1 / 2),
    1 = $space--1,
    2 = $space--2,
    3 = $space--3,
    4 = $space--4,
    5 = $space--5;

## Contributing

We would love contributions, in particular keeping it fresh and neat as some aspects of the project may fall behind with evolving standards.

    yarn install
    yarn watch
