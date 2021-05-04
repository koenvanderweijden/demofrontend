/*
 * Copyright 2019-2020 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { BrComponent, BrPage, BrPageContext } from '@bloomreach/react-sdk';
import { initialize } from '@bloomreach/spa-sdk';
import { relevance } from '@bloomreach/spa-sdk/lib/express';
import { Banner, Content, Menu, NewsList } from '../components';

export default function Index({ configuration, page }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const mapping = { Banner, Content, 'News List': NewsList, 'Simple Content': Content };

  return (
    <BrPage
      configuration={{ ...configuration, httpClient: axios }}
      mapping={mapping}
      page={page}
    >
      <header>
        <nav className="navbar navbar-expand-sm navbar-dark sticky-top bg-dark" role="navigation">
          <div className="container">
            <BrPageContext.Consumer>
              { page => (
                <Link href={page?.getUrl('/') ?? ''}>
                  <a className="navbar-brand">{ page?.getTitle() || 'brXM + Next.js = ♥️'}</a>
                </Link>
              ) }
            </BrPageContext.Consumer>
            <div className="collapse navbar-collapse">
              <BrComponent path="menu">
                <Menu />
              </BrComponent>
            </div>
          </div>
        </nav>
      </header>
      <section className="container flex-fill pt-3">
        <BrComponent path="main" />
      </section>
      <footer className="bg-dark text-light py-3">
        <div className="container clearfix">
          <div className="float-left pr-3">&copy; Bloomreach</div>
          <div className="overflow-hidden">
            <BrComponent path="footer" />
          </div>
        </div>
      </footer>
    </BrPage>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req: request,
  res: response,
  resolvedUrl: path,
}) => {
  relevance(request, response);

  const configuration = {
    path,
    endpoint: process.env.BRXM_ENDPOINT ?? null,
    endpointQueryParameter: 'endpoint',
  };
  const page = await initialize({ ...configuration, request, httpClient: axios });

  return { props: { configuration, page: page.toJSON() } };
}
