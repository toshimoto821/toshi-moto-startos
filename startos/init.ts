import { actions } from "./actions";
import { restoreInit } from "./backups";
import { versionGraph } from "./install/versionGraph";
import { sdk } from "./sdk";

export const init = sdk.setupInit(
	restoreInit,
	versionGraph,
	async () => null, // no interfaces to set
	async () => null, // no dependencies to set
	actions,
);

export const uninit = sdk.setupUninit(versionGraph);
