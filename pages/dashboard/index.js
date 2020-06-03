import Layout from '../../components/Layout';
import {
    Stack,
    Text,
    Selection,
    MarqueeSelection,
    Fabric,
    mergeStyles,
    OverflowSet,
    SearchBox,
    initializeIcons,
    FontIcon
} from '@fluentui/react'

export default function Post() {

    return (
        <Layout>
            <Stack>
                <Text variant='large' nowrap block>
                    Dashboard
                </Text>
            </Stack>
        </Layout>
    );
}