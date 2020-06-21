const loadGruntTasks = require("load-grunt-tasks");

const sass = require("sass");

const data = require("./src/assets/data/initdata");

// fetch command line arguments
const arg = ((argList) => {
  let arg = {},
    a,
    opt,
    thisOpt,
    curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, "");

    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    } else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  }

  return arg;
})(process.argv);

module.exports = (grunt) => {
  grunt.initConfig({
    clean: {
      temp: "temp",
    },

    sass: {
      options: {
        implementation: sass,
      },
      main: {
        files: [
          {
            expand: true,
            cwd: "src/assets/styles",
            src: ["*.scss"],
            dest: "temp/assets/styles",
            ext: ".css",
          },
        ],
      },
    },

    babel: {
      options: {
        presets: ["@babel/preset-env"],
      },
      main: {
        files: [
          {
            expand: true,
            cwd: "src/assets/scripts",
            src: ["*.js"],
            dest: "temp/assets/scripts",
            ext: ".js",
          },
        ],
      },
    },

    web_swig: {
      options: {
        swigOptions: {
          cache: false,
        },
        getData: function (tpl) {
          return data;
        },
      },
      main: {
        files: [
          {
            expand: true,
            cwd: "src",
            src: ["*.html"],
            dest: "temp",
            ext: ".html",
          },
        ],
      },
    },

    watch: {
      style: {
        files: ["src/assets/styles/*.scss"],
        tasks: ["sass"],
        options: {
          spawn: false,
        },
      },
      script: {
        files: ["src/assets/scripts/*.js"],
        tasks: ["babel"],
        options: {
          spawn: false,
        },
      },
      page: {
        files: ["src/*.html"],
        tasks: ["web_swig"],
        options: {
          spawn: false,
        },
      },
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            "temp/assets/styles/*.scss",
            "temp/assets/scripts/*.js",
            "temp/*.html",
          ],
        },

        options: {
          watchTask: true,
          notify: false,
          port: arg.port || 2080,
          open: arg.open || false,
          server: {
            baseDir: ["./temp", "./src", "./public"],
            routes: {
              "/node_modules": "node_modules",
            },
          },
        },
      },
    },
  });

  loadGruntTasks(grunt);

  grunt.registerTask("compile", ["sass", "babel", "web_swig"]);
  grunt.registerTask("start", ["browserSync", "watch"]);
};
