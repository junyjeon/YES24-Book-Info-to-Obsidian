import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import * as fs from "fs";
import * as path from "path";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	watchDir: string;

	async onload() {
		console.log("Plugin loaded"); // 플러그인 로드 확인
		new Notice("Plugin loaded");

		await this.loadSettings();
		// 옵시디언 최상위 디렉토리 설정
		this.watchDir = this.app.vault.getRoot().path;

		console.log("Watching directory:", this.watchDir); // 경로 확인
		// 디렉토리 모니터링 시작
		fs.watch(this.watchDir, (eventType, filename) => {
			if (
				filename &&
				eventType === "rename" &&
				filename.endsWith(".json")
			) {
				const filePath = path.join(this.watchDir, filename);
				fs.readFile(filePath, "utf8", (err, data) => {
					if (err) {
						new Notice("Failed to read file.");
						return;
					}
					const bookData = JSON.parse(data);
					this.createMarkdownFile(bookData);
					fs.unlink(filePath, (err) => {
						if (err) {
							new Notice("Failed to delete file.");
						}
					});
				});
			}
		});

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// this.openFileDialog(); // 필요 없다면 제거
				new Notice("Select the bookData.json file");
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: () => {
				new SampleModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {
		console.log("Plugin unloaded"); // 플러그인 언로드 확인
		new Notice("Plugin unloaded");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	// 마크다운 파일 생성
	createMarkdownFile(bookData: Record<string, any>) {
		if (Object.keys(bookData).length === 0) {
			new Notice("No book data found.");
			return;
		}

		const fileName = `${bookData.title.mainTitle}.md`;
		const fileContent = `
		# ${bookData.title.mainTitle}
		## ${bookData.title.subTitle}
		
		![Book Image](${bookData.imageSrc})
		
		**Authors:** ${bookData.authors.map((author: any) => author.name).join(", ")}
		**Publisher:** ${bookData.publisher}
		**Publish Date:** ${bookData.publishDate}
		**ISBN13:** ${bookData.isbn.isbn13}
		**ISBN10:** ${bookData.isbn.isbn10}
		**Page Info:** ${bookData.pageInfo}
		**List Price:** ${bookData.price.listPrice}
		**Sale Price:** ${bookData.price.salePrice}
		**YES Points:** ${bookData.price.yesPointReward}
		**Rating:** ${bookData.rating}
		**Review Count:** ${bookData.reviewCount}
		**Sales Point:** ${bookData.salesPoint}
		**Best Rank:** ${bookData.bestRank}
		**Categories:** ${bookData.categories.join(", ")}`;

		this.app.vault.create(fileName, fileContent).then(() => {
			new Notice(`Created file: ${fileName}`);
		});
	}
}

// Modal
class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

// Setting Tab
class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
