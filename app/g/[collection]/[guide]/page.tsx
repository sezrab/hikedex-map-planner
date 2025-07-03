import GuideContent from "./guideContent";
import { guidesConfig } from '@/app/guides/guidesConfig';
import type { Metadata } from 'next';

// Define PageProps to match generated types: params/searchParams are Promise or undefined
export interface PageProps {
    params?: Promise<Record<string, string | string[] | undefined>>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    let awaitedParams: Record<string, unknown> | undefined;
    if (params && typeof (params as Promise<unknown>).then === 'function') {
        awaitedParams = await params as Record<string, unknown>;
    } else {
        awaitedParams = params as Record<string, unknown> | undefined;
    }
    const collection = typeof awaitedParams?.collection === 'string' ? awaitedParams.collection : undefined;
    const guideKey = typeof awaitedParams?.guide === 'string' ? awaitedParams.guide : undefined;
    const guide = collection ? guidesConfig[collection] : undefined;
    const page = guide && guideKey ? guide.pages[guideKey] : undefined;
    if (!guide || !page) return {};
    return {
        title: `${page.title || guide.guideTitle} | Hikedex`,
        description: page.description || guide.guideDescriptionShort || guide.guideDescription,
        openGraph: {
            title: `${page.title || guide.guideTitle} | Hikedex`,
            description: page.description || guide.guideDescriptionShort || guide.guideDescription,
            url: `https://hikedex.app/g/${collection}/${guideKey}`,
            images: guide.guideImage ? [
                {
                    url: guide.guideImage,
                    width: 1200,
                    height: 630,
                    alt: guide.guideTitle
                }
            ] : undefined,
            type: 'website',
        },
    };
}

export default function GuidePage() {
    return <GuideContent />;
}
