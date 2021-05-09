import { DH_CHECK_P_NOT_PRIME } from "node:constants";
import { CancellationToken, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext } from "vscode";
import { CheckManager } from "../check_manager";
import { TfSecCheck } from "../tfsec_check";
import { TfsecTreeItem } from "./tfsec_treeitem";

export class TfsecHelpProvider implements WebviewViewProvider {
    private view : Webview | undefined;
    
    resolveWebviewView(webviewView: WebviewView, context: WebviewViewResolveContext<unknown>, token: CancellationToken): void | Thenable<void> {
        this.view = webviewView.webview;
        this.update(null);
    }

    update(item: TfsecTreeItem | null) {
        if (this.view === undefined) {
            return;
        }
        if (item === null) {
            return ;
        }
        const codeData = CheckManager.getInstance().get(item.code);
        if (codeData === null) {
            return;
        }

        this.view.html = getHtml(codeData);
    }
}

function getHtml(codeData: TfSecCheck | undefined): string {
    if (codeData === null) {
        return "";
    }
    return`
    <h2>${codeData?.code}</h2>
    ${codeData?.summary}

    <h3>Impact</h3>
    ${codeData?.impact}

    <h3>Resolution</h3>
    ${codeData?.resolution}

    <h3>More Information</h3>
    <a href="${codeData?.docUrl}">${codeData?.docUrl}</a>
    `;
}
