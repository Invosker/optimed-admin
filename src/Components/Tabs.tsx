import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/BaseComponents/ui/tabs"; // Assuming these components have been converted and their types are exported
import React, { ReactNode } from "react"; // Import React and ReactNode

// Define the structure for each tab object
interface Tab {
  /**
   * The value associated with the tab. This is used by Radix UI to link triggers and content.
   * Should be a string.
   */
  value: string;
  /**
   * The label text displayed on the tab trigger.
   */
  label: string;
  /**
   * The content to be displayed when this tab is active.
   */
  content: ReactNode; // Use ReactNode for the content type
  // Add any other properties that might exist on a tab object
}

// Define the props for the CustomTabs component
interface CustomTabsProps {
  /**
   * An array of tab objects, each defining a tab's value, label, and content.
   */
  tabs: Tab[]; // Array of Tab objects
  // Add other props for the main Tabs component if needed, by extending TabsProps
  // extends TabsProps
}

/**
 * A custom tabs component that renders vertical tabs based on a provided array of tab definitions.
 * It uses the Radix UI Tabs primitive components.
 *
 * @param {CustomTabsProps} param0 The component's props.
 * @param {Tab[]} param0.tabs An array of tab objects (value, label, content).
 * @returns {React.FC} A React functional component for the custom tabs.
 */
const CustomTabs: React.FC<CustomTabsProps> = ({ tabs }) => {
  return (
    <Tabs defaultValue={tabs[0]?.value || "default-tab"} orientation="vertical" className="w-full flex-row">
      <TabsList className="flex-col">
        {/* Map over the tabs array to render TabsTrigger components */}
        {
          tabs.map((tab, index) => {
            return (
              <TabsTrigger key={index} value={tab.value} className="w-full">
                {tab.label}
              </TabsTrigger>
            );
          })
        }
        {/* Commented out example triggers as in original */}
        {/* <TabsTrigger value="tab-1" className="w-full">
                    Overview
                </TabsTrigger>
                <TabsTrigger value="tab-2" className="w-full">
                    Projects
                </TabsTrigger>
                <TabsTrigger value="tab-3" className="w-full">
                    Packages
                </TabsTrigger> */}
      </TabsList>
      <div className="grow rounded-md border text-start">
        {/* Map over the tabs array to render TabsContent components */}
        {
          tabs.map((tab, index) => {
            return (
              <TabsContent key={index} value={tab.value}>
                {tab.content}
              </TabsContent>
            );
          })
        }
        {/* Commented out example content as in original */}
        {/* <TabsContent value="tab-1">
                    <p className="text-muted-foreground px-4 py-3 text-xs">
                        Content for Tab 1
                    </p>
                </TabsContent>
                <TabsContent value="tab-2">
                    <p className="text-muted-foreground px-4 py-3 text-xs">
                        Content for Tab 2
                    </p>
                </TabsContent>
                <TabsContent value="tab-3">
                    <p className="text-muted-foreground px-4 py-3 text-xs">
                        Content for Tab 3
                    </p>
                </TabsContent> */}
      </div>
    </Tabs>
  );
};

export default CustomTabs;