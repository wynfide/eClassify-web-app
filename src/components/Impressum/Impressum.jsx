'use client'

import { t } from '@/utils';
import BreadcrumbComponent from '@/components/BreadcrumbComponent';

const Impressum = () => {
  return (
    <main className="container">
      {/* Breadcrumb */}
      <BreadcrumbComponent title2={t("impressum")} />

      <div className="page_content">
        <h1 className="text-3xl font-bold mb-6">{t("impressum")}</h1>

        <section className="mb-6">
          <p>
            <strong>Ramez Alsaidawi</strong><br />
            Einzelunternehmer<br />
            Raderberger Straße 129<br />
            50968 Köln
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("contact")}</h2>
          <p>
            Telefon: +49 174 9509920<br />
            E-Mail: <a href="mailto:info@wynfi.de" className="text-blue-600 underline">info@wynfi.de</a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("vatId")}</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            DE453838727
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("businessLicense")}</h2>
          <p>
            Die Gewerbeerlaubnis nach § 14 oder § 55c GewO wurde am 16.01.2025 von folgender Stelle erteilt:<br />
            Gewerbeamt Köln
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("jobTitleAndRules")}</h2>
          <p>
            Berufsbezeichnung: Informatiker<br />
            Zuständige Kammer: IHK Köln<br />
            Verliehen in: Deutschland
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("editorialResponsible")}</h2>
          <p>
            Ramez Alsaidawi<br />
            Raderberger Straße 129<br />
            50968 Köln
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("disputeResolution")}
          </h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section>
          <p className="text-sm text-gray-500">
            Quelle: <a href="https://www.e-recht24.de" className="underline">e-recht24.de</a>
          </p>
        </section>
      </div>
    </main>
  );
};

export default Impressum;
