
import BioBlock from '@/components/home/BioBlock';
import TechStackBlock from '@/components/home/TechStackBlock';
import LatestArticlesBlock from '@/components/home/LatestArticlesBlock';
import ContactBlock from '@/components/home/ContactBlock';
import PhotoBlock from '@/components/home/PhotoBlock';
import DashboardModal from '@/components/DashboardModal';

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-white p-4 md:p-8 flex items-center justify-center">
      <div
        className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]"
        style={{ perspective: '1000px' }}
      >
        {/* Photo Block - Top Left */}
        <div className="md:col-span-1 md:row-span-1 min-h-[280px]">
          <PhotoBlock />
        </div>

        {/* Bio Block - Top Center-Right, spans 3 columns */}
        <div className="md:col-span-3 md:row-span-1 min-h-[250px]">
          <BioBlock />
        </div>

        {/* Latest Articles - Middle Left, spans 2 columns */}
        <div className="md:col-span-2 md:row-span-1 h-full">
          <LatestArticlesBlock />
        </div>

        {/* Tech Stack - Middle Right, spans 2 columns */}
        <div className="md:col-span-2 md:row-span-1 min-h-[200px]">
          <TechStackBlock />
        </div>

        {/* Contact Form - Bottom, spans full width */}
        <div className="md:col-span-4 md:row-span-1 min-h-[200px]">
          <ContactBlock />
        </div>
      </div>
      <DashboardModal />
    </main>
  );
}
