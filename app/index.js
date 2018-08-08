'use strict';
const Generator = require('yeoman-generator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const chalk = require('chalk');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    this.option('debug', {
      desc: '开发调试模式',
      type: Boolean
    });
    this.templateSrcPath = 'src/main/webapp/';

  }

  initializing() {
    this.pkg = require('../package.json');
  }

  prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('欢迎使用 汉图研发部前端框架脚手架 使用本工具生成 AngularJS 单页面应用， 其中还包括 jQuery,bower,gulp 来管理项目'));
    }

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: '请输入项目名称（XyzFrontend/XyzBackend）',
        default: this.appname // Default to current folder name
      },
      {
        type: 'input',
        name: 'projectGroupID',
        message: '请输入项目GroupID(com.handsmap.xxx)',
        default: 'com.handsmap.xxx' // Default to current folder name
      },
      {
        type: 'checkbox',
        name: 'features',
        message: '需要添加哪些附加组件?',
        choices: [{
          name: 'Websocket',
          value: 'includeWebsocket',
          checked: true
        }, {
          name: 'Datatable',
          value: 'includeDatatable',
          checked: true
        }, {
          name: 'Angular Bootstrap',
          value: 'isIncludeAB',
          checked: false
        }, {
          name: 'Angular RxJS',
          value: 'isIncludeRxJS',
          checked: true
        },

        ]
      }];

    return this.prompt(prompts).then(answers => {
      const features = answers.features;
      const hasFeature = feat => features && features.indexOf(feat) !== -1;
      console.log(answers);
      this.hasFeature = hasFeature;
      this.build = answers;

    });
  }

  writing() {
    this._writingGulpfile();
    this._writingPackageJSON();
    this._writingBower();
    this._writingProjectConfigs();
    this._writingPom();
    this._writingAssets();
    this._writingScripts();
    this._writingIndex();
    this._writingWeb_INF();
    this._writingReadme();

  }

  _writingGulpfile() {
    console.log(this._getKebabCase,this.build.projectName);
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      {
        date: (new Date).toISOString().split('T')[0],
        name: this.pkg.name,
        version: this.pkg.version
      }
    );
    this.fs.copyTpl(
      this.templatePath('gulp'),
      this.destinationPath('gulp'),
      {
        projectName: this._getKebabCase(this.build.projectName)
      }
    );
  }


  _writingPackageJSON() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      { appname: this.build.projectName }
    );
  }

  _writingBower() {
    this.fs.copyTpl(
      this.templatePath('bower.json'),
      this.destinationPath('bower.json'),
      {
        projectName: this.build.projectName,
        isIncludeWS: this.hasFeature('includeWebsocket'),
        isIncludeDatatable: this.hasFeature('includeDatatable'),
        isIncludeAB: this.hasFeature('isIncludeAB'),
        isIncludeRxJS: this.hasFeature('isIncludeRxJS')
      });
  }

  _writingProjectConfigs() {
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
    this.fs.copy(
      this.templatePath('eslintignore'),
      this.destinationPath('.eslintignore')
    );
    this.fs.copy(
      this.templatePath('eslintrc.json'),
      this.destinationPath('eslintrc.json')
    );
    this.fs.copy(
      this.templatePath('bowerrc'),
      this.destinationPath('.bowerrc')
    );
    this.fs.copy(
      this.templatePath('npmrc'),
      this.destinationPath('.npmrc')
    );
  }

  _writingPom() {

    this.fs.copyTpl(
      this.templatePath('pom.xml'),
      this.destinationPath('pom.xml'),
      {
        groupId: this.build.projectGroupID,
        projectName: this._getKebabCase(this.build.projectName)
      }
    )
  }

  _writingAssets() {
    // 拷贝 资源文件
    this.fs.copy(
      this.templatePath(this.templateSrcPath + 'assets'),
      this.destinationPath(this.templateSrcPath + 'assets')
    );
  }

  _writingScripts() {
    this.fs.copyTpl(
      this.templatePath(this.templateSrcPath + 'app/'),
      this.destinationPath(this.templateSrcPath + 'app/'),
      {
        projectName: this.build.projectName,
        isIncludeWS: this.hasFeature('includeWebsocket'),
        isIncludeDatatable: this.hasFeature('includeDatatable'),
        isIncludeAB: this.hasFeature('isIncludeAB'),
        isIncludeRxJS: this.hasFeature('isIncludeRxJS')
      }
    );
  }

  _writingIndex() {
    this.fs.copyTpl(
      this.templatePath(this.templateSrcPath + 'template/'),
      this.destinationPath(this.templateSrcPath + 'template/'),
      {
        projectName: this.build.projectName
      }
    );
  }

  _writingWeb_INF() {
    this.fs.copyTpl(
      this.templatePath(this.templateSrcPath + 'WEB-INF/'),
      this.destinationPath(this.templateSrcPath + 'WEB-INF/')
    );
  }

  _writingReadme() {
    this.fs.copy(
      this.templatePath('README.md'),
      this.destinationPath('README.md')
    );
  }

  _getKebabCase(str) {
    var arr = str.split('');
    str = arr.map(function (item) {
      if (item.toUpperCase() === item) {
        return '-' + item.toLowerCase();
      } else {
        return item;
      }
    }).join('');
    return str.substring(1);
  }

  install() {
    if (this.options['debug']) {
      console.log('调试模式，无需安装');
      return;
    }
    const hasYarn = commandExists('yarn');
    this.installDependencies({
      npm: !hasYarn,
      bower: true,
      yarn: hasYarn,
      skipInstall: this.options['skip-install']
    });
  }

  end() {
    if (this.options['debug']) {
      console.log('调试模式，不进行安装');
      return;
    }
    const howToInstall = `
运行 ${chalk.yellow.bold('npm install & bower install')} 之后, 运行项目使用： ${chalk.yellow.bold('gulp --port=xxx --pages=yyy')}.`;

    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }


  }
};
