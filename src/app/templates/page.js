import Layout from "@/components/Layout";
import { Card } from "@/components/Card";
import templatesData from "@/data/templates.json";
import styles from "../page.module.css";
import { FiDownload } from "react-icons/fi";

export default function TemplatesLibrary() {
  return (
    <Layout>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Templates Library</h1>
          <p className={styles.pageSubtitle}>Download professional resources and checklists for your NGO.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {templatesData.map(template => (
          <Card key={template.id} title={template.title} badge={template.format} badgeType="success" actionText="View Template" actionLink={`/templates/${template.id}`}>
            <p style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 500 }}>{template.category}</p>
            <p style={{ minHeight: '60px' }}>{template.description}</p>
          </Card>
        ))}
      </div>
    </Layout>
  );
}
