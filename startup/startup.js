const shell = require("shelljs");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Type the name of the theme: ", function(themeName) {
    shell.echo("The theme name '" + themeName + "' will be used!");
    //console.log("The theme name '" + themeName + "' will be used!");

    let errorCode = validateThemeName(themeName);

    if (!errorCode) {
        errorCode = replaceThemeName(themeName);
    }

    rl.close();

    if (errorCode) {
        return errorCode;
    }
});

function validateThemeName() {
    //TODO: implement
}

function replaceThemeName(themeName) {
    let dir = shell.pwd();

    if (!shell.test('-e', dir + '/package.json')) {
        shell.echo("Please, run this command from the theme directory!");
        return 1;
    }

    shell.ls('*.php').forEach(function(file) {
        //1. Search for `'_s'` (inside single quotations) to capture the text domain and replace with: `'megatherium-is-awesome'`.
        shell.sed('-i', /'_s'/g, "'" + themeName + "'", file);
        //2. Search for `_s_` to capture all the functions names and replace with: `megatherium_is_awesome_`.
        shell.sed('-i', /_s_/g, themeName + "_", file);
    });

    //3. Search for `Text Domain: _s` in `style.css` and replace with: `Text Domain: megatherium-is-awesome`.
    shell.sed('-i', /Theme Name: _s/g, 'Theme Name: ' + themeName, 'sass/style.scss');
    shell.sed('-i', /Text Domain: _s/g, 'Text Domain: ' + themeName, 'sass/style.scss');
    shell.sed('-i', /Theme Name: _s/g, 'Theme Name: ' + themeName, 'sass/woocommerce.scss');

    shell.ls('*.php').forEach(function(file) {
        //4. Search for <code>&nbsp;_s</code> (with a space before it) to capture DocBlocks and replace with: <code>&nbsp;Megatherium_is_Awesome</code>.
        shell.sed('-i', / _s/g, ' ' + themeName, file);
        //5. Search for `_s-` to capture prefixed handles and replace with: `megatherium-is-awesome-`.
        shell.sed('-i', /_s-/g, themeName + "-", file);
        //6. Search for `_S_` (in uppercase) to capture constants and replace with: `MEGATHERIUM_IS_AWESOME_`.
        shell.sed('-i', /_S_/g, "_" + themeName.toUpperCase() + "_", file);
    });

    shell.sed('-i', /"_s"/g, '"' + themeName + '"', 'phpcs.xml.dist');
    shell.sed('-i', /_s\.zip/g, themeName + '.zip', 'package.json');

}
