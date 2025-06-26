"use client";
import { useParams } from 'next/navigation';
import { guidesConfig } from '@/app/guides/guidesConfig';
import GuideTemplate from '@/app/components/GuideTemplate';

export default function GuidePage() {
    const params = useParams();
    // url is like /g/[collection]/[guide]
    // so params is an object with keys 'collection' and 'guide'
    const guideKey = typeof params.collection === 'string' ? params.collection : Array.isArray(params.collection) ? params.collection[0] : '';
    const pageKey = typeof params.guide === 'string' ? params.guide : Array.isArray(params.guide) ? params.guide[0] : '';
    console.log('GuidePage params:', params, 'guideKey:', guideKey, 'pageKey:', pageKey);
    if (!guideKey || !pageKey || !(guideKey in guidesConfig)) {
        return (
            <main>
                <title>Not found | Hikedex Guides</title>
                <meta name="robots" content="noindex, nofollow" />
                <h1>Sorry, this guide page does not exist.</h1>
            </main>
        );
    }
    const guide = guidesConfig[guideKey as keyof typeof guidesConfig];
    const page = guide.pages[pageKey];

    return (
        <GuideTemplate
            {...page}
            guideType={guide.guideType}
        />
    );
}
