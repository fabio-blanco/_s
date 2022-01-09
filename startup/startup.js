const shell = require("shelljs");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function validateThemeName(themeName) {
    if (/\s/g.test(themeName)) {
        shell.echo("Invalid theme name. Please don't use spaces!");
        return 1;
    }
}

function doStartUp(themeName, removeGitFolders, removePotFile) {
    let errorCode = replaceThemeName(themeName);

    if (!errorCode && removeGitFolders) {
        errorCode = doRemoveGitFolders();
    }

    if (!errorCode && removePotFile) {
        errorCode = doRemovePotFile();
    }

    return errorCode;
}

function replaceThemeName(themeName) {
    let dir = shell.pwd();

    if (!shell.test('-e', dir + '/package.json')) {
        shell.echo("Please, run this command from the theme directory!");
        return 1;
    }

    shell.ls('*.php', 'inc/*.php').forEach(function(file) {
        //1. Search for `'_s'` (inside single quotations) to capture the text domain and replace with: `'megatherium-is-awesome'`.
        shell.sed('-i', /'esqueleto'/g, "'" + themeName + "'", file);
        //2. Search for `_s_` to capture all the functions names and replace with: `megatherium_is_awesome_`.
        shell.sed('-i', /esqueleto_/g, themeName + "_", file);
    });

    //3. Search for `Text Domain: _s` in `style.css` and replace with: `Text Domain: megatherium-is-awesome`.
    shell.sed('-i', /Theme Name: esqueleto/g, 'Theme Name: ' + themeName, 'sass/style.scss');
    shell.sed('-i', /Text Domain: esqueleto/g, 'Text Domain: ' + themeName, 'sass/style.scss');
    shell.sed('-i', /this_theme is based/g, themeName + ' is based', 'sass/style.scss');

    shell.sed('-i', /Theme Name: esqueleto/g, 'Theme Name: ' + themeName, 'sass/_theme-header.scss');
    shell.sed('-i', /Text Domain: esqueleto/g, 'Text Domain: ' + themeName, 'sass/_theme-header.scss');
    shell.sed('-i', /this_theme is based/g, themeName + ' is based', 'sass/_theme-header.scss');

    shell.sed('-i', /Theme Name: esqueleto/g, 'Theme Name: ' + themeName, 'sass/woocommerce.scss');

    shell.ls('*.php', 'inc/*.php', 'template-parts/*.php').forEach(function(file) {
        //4. Search for <code>&nbsp;_s</code> (with a space before it) to capture DocBlocks and replace with: <code>&nbsp;Megatherium_is_Awesome</code>.
        shell.sed('-i', / esqueleto/g, ' ' + themeName, file);
        shell.sed('-i', /\sesqueleto/g, ' ' + themeName, file);
        //5. Search for `_s-` to capture prefixed handles and replace with: `megatherium-is-awesome-`.
        shell.sed('-i', /esqueleto-/g, themeName + "-", file);
        //6. Search for `_S_` (in uppercase) to capture constants and replace with: `MEGATHERIUM_IS_AWESOME_`.
        shell.sed('-i', /ESQUELETO_/g, themeName.toUpperCase() + "_", file);
    });

    shell.sed('-i', /"esqueleto"/g, '"' + themeName + '"', 'phpcs.xml.dist');
    shell.sed('-i', /esqueleto\.zip/g, themeName + '.zip', 'package.json');
    shell.sed('-i', /esqueleto\.pot/g, themeName + '.pot', 'composer.json');

    shell.echo("The theme startup is ready!");
}


function doRemoveGitFolders() {
    const {code} = shell.rm('-rf', ['.git', '.github', '.gitignore', '.gitattributes']);

    return code;
}

function doRemovePotFile() {
    const {code} = shell.rm('languages/esqueleto.pot');

    return code;
}

function main() {
    rl.question("Type the name of the theme: ", function(themeName) {
        shell.echo("The theme name '" + themeName + "' will be used!");

        let errorCode = validateThemeName(themeName);

        if (!errorCode) {

            rl.question("Strip off git files? (Y, n): ", function (answer) {
                let removeGitFolders = true;

                if (answer && answer.trim().toLowerCase() === 'n') {
                    removeGitFolders = false;
                } else if(answer && answer.trim().toLowerCase() !== 'y') {
                    shell.echo("Unknown option! Please provide one of the following: y, n");
                    errorCode = 1;
                }

                if (!errorCode) {


                    rl.question("Remove the esqueleto.pot file? (Y, n):", function (removePotAnswer) {
                        let removePotFile = true;

                        if(removePotAnswer && removePotAnswer.trim().toLowerCase() === 'n') {
                            removePotFile = false;
                        } else if(removePotAnswer && removePotAnswer.trim().toLowerCase() !== 'y') {

                        }

                        if (!errorCode) {
                            errorCode = doStartUp(themeName, removeGitFolders, removePotFile);
                        }

                        rl.close();
                    });

                }


            });

        }

        if (errorCode) {
            return errorCode;
        }
    });
}

main();
