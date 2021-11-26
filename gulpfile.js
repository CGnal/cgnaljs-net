const del = require("del");
const eslint = require("gulp-eslint-new");
const gulp = require("gulp");
const jest = require("gulp-jest").default;
const jsdoc = require("gulp-jsdoc3");
const shell = require("gulp-shell");

const jestBaseConfig = require("./jest.config");
const jsdocConfig = require("./jsdoc.config.json");

/* env */

gulp.task("set-dev-env", cb => {
    process.env.NODE_ENV = "development";

    return cb();
});

gulp.task("set-prod-env", cb => {
    process.env.NODE_ENV = "production";

    return cb();
});

gulp.task("set-test-env", cb => {
    process.env.NODE_ENV = "test";

    return cb();
});

/* clean-up */

gulp.task("clean:coverage", () => del("./coverage"));
gulp.task("clean:docs", () => del("./docs"));
gulp.task("clean", gulp.parallel("clean:coverage", "clean:docs"));

/* docs */

gulp.task("docs", gulp.series(
    "clean:docs",
    cb => gulp.src("./src/**/*.js", { read: false }).pipe(jsdoc(jsdocConfig), cb)
));

/* lint */

const lintCodeWith = settings => () => gulp.src(settings.inputs)
    .pipe(eslint(settings.configPath))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

gulp.task("lint:code", lintCodeWith({
    configPath: "./.eslintrc.js",
    inputs: ["./src/**/*.js", "!./src/**/__{tests,mocks}__/**"]
}));

gulp.task("lint:tests", lintCodeWith({
    configPath: "./.eslintrc.test.json",
    inputs: ["./*.js", "./__mocks__/**/*.js", "./src/**/__{tests,mocks}__/**/*.js"]
}));

gulp.task("lint", gulp.series("lint:code", "lint:tests"));

/* test */

const testWith = extraSettings => gulp.series(
    "set-test-env",
    () => gulp.src("./src", { read: false }).pipe(jest({ ...jestBaseConfig, ...extraSettings }))
);

gulp.task("test", testWith({}));

gulp.task("test:coverage", gulp.series("clean:coverage", testWith({ collectCoverage: true })));

gulp.task("test:verbose", testWith({ verbose: true }));

gulp.task("test:watch", gulp.series(
    "set-test-env",
    async () => gulp.src("./src", { read: false }).pipe(jest({ ...jestBaseConfig, watch: true }))
));

/* deploy */

gulp.task("bump", shell.task("bump package.json package-lock.json"));

/* default */

gulp.task("default", gulp.series("lint", "test:coverage"));
