import { test, request, Page } from '@playwright/test';
import { PluginPage } from '@pages/pluginPage';
import { ApiUtils } from '@utils/apiUtils';
import { data } from '@utils/testData';
import { payloads } from '@utils/payloads';

const { DOKAN_PRO } = process.env;

test.describe.skip('Plugin functionality test', () => {
    let admin: PluginPage;
    let aPage: Page;
    let apiUtils: ApiUtils;

    test.beforeAll(async ({ browser }) => {
        const adminContext = await browser.newContext(data.auth.adminAuth);
        aPage = await adminContext.newPage();
        admin = new PluginPage(aPage);

        apiUtils = new ApiUtils(await request.newContext());
        await apiUtils.updatePlugin('dokan/dokan', { status: 'active' }, payloads.adminAuth);
        if (DOKAN_PRO) {
            await apiUtils.updatePlugin('dokan-pro/dokan-pro', { status: 'inactive' }, payloads.adminAuth);
        }
    });

    test.afterAll(async () => {
        await apiUtils.updatePlugin('dokan/dokan', { status: 'active' }, payloads.adminAuth);
        if (DOKAN_PRO) {
            await apiUtils.updatePlugin('dokan-pro/dokan-pro', { status: 'active' }, payloads.adminAuth);
        }
        await aPage.close();
        await apiUtils.dispose();
    });

    test('activate Dokan pro plugin', { tag: ['@pro', '@admin', '@serial'] }, async () => {
        await apiUtils.updatePlugin('dokan-pro/dokan-pro', { status: 'inactive' }, payloads.adminAuth);
        await admin.activatePlugin(data.plugin.pluginName.dokanPro);
    });

    test('deactivate Dokan pro plugin', { tag: ['@pro', '@admin', '@serial'] }, async () => {
        await apiUtils.updatePlugin('dokan-pro/dokan-pro', { status: 'active' }, payloads.adminAuth);
        await admin.deactivateDokanPlugin(data.plugin.pluginName.dokanPro, false);
    });

    test('deactivate Dokan pro plugin with deactivate reason', { tag: ['@pro', '@admin', '@serial'] }, async () => {
        await apiUtils.updatePlugin('dokan-pro/dokan-pro', { status: 'active' }, payloads.adminAuth);
        await admin.deactivateDokanPlugin(data.plugin.pluginName.dokanPro, true);
    });

    test('activate Dokan lite plugin', { tag: ['@lite', '@admin', '@serial'] }, async () => {
        await apiUtils.updatePlugin('dokan/dokan', { status: 'inactive' }, payloads.adminAuth);
        await admin.activatePlugin(data.plugin.pluginName.dokanLite);
    });

    test('deactivate Dokan lite plugin', { tag: ['@lite', '@admin', '@serial'] }, async () => {
        await apiUtils.updatePlugin('dokan/dokan', { status: 'active' }, payloads.adminAuth);
        await admin.deactivateDokanPlugin(data.plugin.pluginName.dokanLite, false);
    });

    test('deactivate Dokan lite plugin with deactivate reason', { tag: ['@lite', '@admin', '@serial'] }, async () => {
        await apiUtils.updatePlugin('dokan/dokan', { status: 'active' }, payloads.adminAuth);
        await admin.deactivateDokanPlugin(data.plugin.pluginName.dokanLite, true);
    });

    test.skip('delete Dokan pro plugin', { tag: ['@pro', '@admin', '@serial'] }, async () => {
        await admin.activatePlugin(data.plugin.pluginName.dokanLite);
    });

    test.skip('delete Dokan lite plugin', { tag: ['@lite', '@admin', '@serial'] }, async () => {
        await admin.activatePlugin(data.plugin.pluginName.dokanLite);
    });
});
