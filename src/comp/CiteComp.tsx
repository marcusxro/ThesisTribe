import React from 'react';
import { IoMdClose } from "react-icons/io";

interface Author {
    name: string;
    affiliation?: string;
    family: string;
    given: string;
    sequence: string;
}

interface ResponseObject {
    best_oa_location: any;
    data_standard: number;
    doi: string;
    doi_url: string;
    first_oa_location: any;
    genre: string;
    has_repository_copy: boolean;
    is_oa: boolean;
    is_paratext: boolean;
    journal_is_in_doaj: boolean;
    journal_is_oa: boolean;
    journal_issn_l: string;
    journal_issns: string;
    journal_name: string;
    oa_locations: any[];
    oa_locations_embargoed: any[];
    oa_status: string;
    publisher: string;
    title: string;
    updated: string;
    year?: number;
    z_authors: Author[];
    Link?: string;
    Publisher?: string;
    Title?: string;
    Updated?: string;
    Genre?: string;
    Authors?: Author[] ;
    Year?: number;
}

interface propsType {
    closer: React.Dispatch<React.SetStateAction<boolean>>
    citeDetails: ResponseObject;
}

const CiteComp: React.FC<propsType> = ({ closer, citeDetails }) => {

    const {
        doi,
        doi_url,
        title,
        publisher,
        year,
        journal_name,
        z_authors,
        genre,
        Year,
        Title,
        Link,
        Publisher,
        Authors
    } = citeDetails;

    console.log(citeDetails)
    // Format authors
    function formatAuthors(authors: Author[] | null): string {
        if (!authors || authors.length === 0) {
            return "";
        }
    
        return authors.map(author => {
            const { family, given } = author;
            return `${given ? given + ' ' : ''}${family}`;
        }).join(", ");
    }
    const apaCitation = () => {
        const citationYear = year ?? Year ?? '';
        const citationTitle = title ?? Title ?? '';
        const citationPublisher = publisher ?? Publisher ?? '';
        const citationDoiUrl = doi_url ?? Link ?? '';
        const formattedAuthors = formatAuthors(z_authors ?? Authors);
    
        // Construct the citation string
        const yearPart = citationYear ? `${citationYear}. ` : '';
        const titlePart = citationTitle ? `<i>${citationTitle}</i>. ` : '';
        const publisherPart = citationPublisher ? `${citationPublisher}. ` : '';
        const doiPart = citationDoiUrl ? `<a href="${citationDoiUrl}">${citationDoiUrl}</a>` : '';
    
        return `${formattedAuthors ? `${formattedAuthors}. ` : ''}${titlePart}${yearPart}${publisherPart}${doiPart}`;
    };
    
    const mlaCitation = () => {
        const citationYear = year ?? Year ?? '';
        const citationTitle = title ?? Title ?? '';
        const citationPublisher = publisher ?? Publisher ?? '';
        const citationDoiUrl = doi_url ?? Link ?? '';
        const formattedAuthors = formatAuthors(z_authors ?? Authors);
    
        // Construct the citation string
        const yearPart = citationYear ? ` (${citationYear}). ` : '';
        const titlePart = citationTitle ? `<i>${citationTitle}</i>. ` : '';
        const publisherPart = citationPublisher ? `${citationPublisher}. ` : '';
        const doiPart = citationDoiUrl ? `<a href="${citationDoiUrl}">${citationDoiUrl}</a>` : '';
    
        return `${formattedAuthors ? `${formattedAuthors}. ` : ''}${titlePart}${yearPart}${publisherPart}${doiPart}`;
    };
    
    
    // Chicago Citation
    const chicagoCitation = () => {
        const citationYear = year ?? Year ?? '';
        const citationTitle = title ?? Title ?? '';
        const citationPublisher = publisher ?? Publisher ?? '';
        const citationDoiUrl = doi_url ?? Link ?? '';
        const formattedAuthors = formatAuthors(z_authors ?? Authors);
    
        // Construct the citation string
        const yearPart = citationYear ? `(${citationYear}). ` : '';
        const titlePart = citationTitle ? `<i>${citationTitle}</i>. ` : '';
        const publisherPart = citationPublisher ? `${citationPublisher}. ` : '';
        const doiPart = citationDoiUrl ? `<a href="${citationDoiUrl}">${citationDoiUrl}</a>` : '';
    
        return `${formattedAuthors ? `${formattedAuthors}. ` : ''}${titlePart}${yearPart}${publisherPart}${doiPart}`;
    };
    

    return (
        <div
            onClick={() => { closer(false) }}
            className='modalPos'>
            <div
                onClick={(e) => { e.stopPropagation() }}
                className='w-full max-w-[400px] h-full max-h-[600px] overflow-auto book rounded-lg flex flex-col items-start z-10'>
                <div className='h-[40px] w-full flex items-center justify-between bg-[#e6e6e6] px-3'>
                    <div
                        onClick={() => { closer(false) }}
                        className='cursor-pointer'>
                        <IoMdClose />
                    </div>
                    <div>Generated Cite</div>
                </div>
                <div className='w-full h-full pt-4 bg-white px-3 overflow-auto flex gap-4 flex-col text-black pb-3'>
                    <div>
                        <h4 className='font-semibold'>APA</h4>
                        <p dangerouslySetInnerHTML={{ __html: apaCitation() }} />
                    </div>
                    <div>
                        <h4 className='font-semibold'>MLA</h4>
                        <p dangerouslySetInnerHTML={{ __html: mlaCitation() }} />
                    </div>
                    <div>
                        <h4 className='font-semibold'>Chicago</h4>
                        <p dangerouslySetInnerHTML={{ __html: chicagoCitation() }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CiteComp;
