import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CourseContent = ({ course }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-6">Course content</h3>
      <div className="mb-6 text-gray-300">
        {course?.courseContent?.length} sections •{" "}
        {course?.courseContent?.reduce(
          (acc, section) => acc + section?.lectures,
          0
        )}{" "}
        lectures • {course?.duration} total length
      </div>

      <Accordion type="multiple" className="w-full">
        {course.courseContent.map((section, index) => (
          <AccordionItem
            key={index}
            value={`section-${index}`}
            className="border-gray-700"
          >
            <AccordionTrigger className="text-left hover:no-underline hover:bg-gray-700/50 px-4 py-4 rounded-lg transition-colors">
              <div className="flex flex-col items-start">
                <h3 className="font-semibold text-white text-base mb-1">
                  {section?.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {section?.lectures} lectures • {section?.duration}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="bg-gray-700/30 rounded-lg p-4 mt-2">
                <div className="text-gray-300 text-sm space-y-2">
                  <p className="font-medium text-gray-200">Section Overview:</p>
                  <p>
                    This section covers comprehensive topics in{" "}
                    {section?.title?.toLowerCase()}. You&apos;ll learn through{" "}
                    {section?.overview}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <p className="text-xs text-gray-400">
                      {section?.lectures} video lectures • {section?.duration}{" "}
                      total duration
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseContent;
