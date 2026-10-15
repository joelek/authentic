import * as index from "./index";

async function run(): Promise<void> {
	let mailer = new index.SMTPMailer(index.loadConfig("./private/mailer.json"));
	return mailer.send({
		subject: "Subject",
		message: "Message"
	});
};

run().catch((error) => console.log("got error", error));
