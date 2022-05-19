import { default as path, dirname } from "path";
import { fileURLToPath } from "url";
import assert from "yeoman-assert";
import helpers from "yeoman-test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const githubPath = path.join(__dirname, "./index.js");

describe(":github", function () {
	it("generate `.github/*.md` files", async function () {
		await helpers
			.run(githubPath)
			.then(function () {
				assert.file(".github/CODE_OF_CONDUCT.md");
				assert.file(".github/CONTRIBUTING.md");
				assert.file(".github/ISSUE_TEMPLATE/1-bug_report.md");
				assert.file(".github/ISSUE_TEMPLATE/2-new_feature.md");
				assert.file(".github/PULL_REQUEST_TEMPLATE.md");
				assert.file(".github/SECURITY.md");
			});
	});
	it("Should use given project title in CONTRIBUTING.md", async function () {
		await helpers
			.run(githubPath)
			.withPrompts({ title: 'MyAwesomeProject Title' })
			.then(function () {
				assert.fileContent(
					".github/CONTRIBUTING.md",
					"Thanks for your interest in contributing to MyAwesomeProject Title!"
				);
			});
	});
	it("Should use (package.json).title as the project title in CONTRIBUTING.md", async function () {
		await helpers
			.run(githubPath)
			.on('ready', function (generator) {
				generator.fs.write('package.json', '{ "title": "Package Title" }');
			  })
			.then(function () {
				assert.fileContent(
					".github/CONTRIBUTING.md",
					`Thanks for your interest in contributing to Package Title!`
				);
			});
	});
	it("Should use folder name as the project title in CONTRIBUTING.md", async function () {
		await helpers
			.run(githubPath)
			.then(function () {
				assert.fileContent(
					".github/CONTRIBUTING.md",
					`Thanks for your interest in contributing to ${ path.basename( process.cwd() ) }!`
				);
			});
	});
	it("When ideasboard id is given, should generate ideas board link to the category.", async function () {
		await helpers
			.run(githubPath)
			.withPrompts({ ideasboard: 1234567 })
			.then(function () {
				assert.fileContent(
					".github/CONTRIBUTING.md",
					"https://ideas.woocommerce.com/forums/133476-woocommerce?category_id=1234567"
				);
			});
	});
	it("If no ideasboard id given, should generate ideas board link with no category specified.", async function () {
		await helpers
			.run(githubPath)
			.withPrompts({ ideasboard: '' })
			.then(function () {
				assert.fileContent(
					".github/CONTRIBUTING.md",
					/https\:\/\/ideas\.woocommerce\.com\/forums\/133476-woocommerce[^?]/
				);
			});
	});
});
