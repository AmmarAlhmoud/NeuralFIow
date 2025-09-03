import React from "react";
import { X, FileText, Plus, Zap, Star } from "lucide-react";
import { type TaskDrawerProps } from "../../types/dashboard";

const TaskDrawer: React.FC<TaskDrawerProps> = ({ task, isOpen, onClose }) => {
  if (!task) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
        onClick={onClose}
      ></div>
      <div
        className={`fixed right-0 top-0 h-full w-96 glassmorphic z-40 transform transition-transform duration-400 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold dark:text-white text-black">
              {task.title}
            </h2>
            <button
              onClick={onClose}
              className="dark:text-gray-400 dark:hover:text-white text-gray-700 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Task Details */}
            <div>
              <h3 className="font-semibold dark:text-white text-black mb-4">
                Description
              </h3>
              <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-black/10">
                <p className="dark:text-gray-300 text-gray-700 leading-relaxed">
                  {task.description}
                </p>
              </div>
            </div>

            {/* AI Actions */}
            <div>
              <h3 className="font-semibold dark:text-white text-gray-700 mb-4">
                AI Neural Assistant
              </h3>
              <div className="space-y-3">
                <button className="w-full relative overflow-hidden bg-gradient-to-r dark:from-violet-600/20 dark:to-violet-600/20 from-violet-600 to-violet-600 border border-violet-500/30 dark:text-violet-300 text-white px-4 py-3 rounded-xl font-medium hover:bg-violet-600/30 transition-all duration-300 hover:scale-105 group">
                  <span className="flex items-center space-x-3">
                    <FileText className="w-5 h-5" />
                    <span>AI Summarize Task</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </button>

                <button className="w-full relative overflow-hidden bg-gradient-to-r dark:from-cyan-600/20 dark:to-cyan-600/20 from-cyan-600 to-cyan-600 border border-cyan-500/30 dark:text-cyan-300 text-white px-4 py-3 rounded-xl font-medium hover:bg-cyan-600/30 transition-all duration-300 hover:scale-105 group">
                  <span className="flex items-center space-x-3">
                    <Plus className="w-5 h-5" />
                    <span>Generate Subtasks</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </button>

                <button className="w-full relative overflow-hidden bg-gradient-to-r dark:from-orange-600/20 from-orange-600 dark:to-orange-600/20 to-orange-600 border border-orange-500/30 dark:text-orange-300 text-white px-4 py-3 rounded-xl font-medium hover:bg-orange-600/30 transition-all duration-300 hover:scale-105 group">
                  <span className="flex items-center space-x-3">
                    <Zap className="w-5 h-5" />
                    <span>Suggest Priority</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </button>
              </div>
            </div>

            {/* Comments Thread */}
            <div>
              <h3 className="font-semibold dark:text-white text-black mb-4">
                Neural Comments
              </h3>
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-neon-scarlet to-neon-fuchsia rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="dark:bg-white/5 bg-black/5 rounded-xl p-4 border dark:border-white/10 border-black/10">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium dark:text-white text-black text-sm">
                          Alex Chen
                        </span>
                        <span className="text-xs dark:text-gray-400 text-gray-800">
                          2 hours ago
                        </span>
                      </div>
                      <p className="text-sm dark:text-gray-300 text-gray-700">
                        I've started the initial research phase. The AI analysis
                        suggests focusing on video content for better engagement
                        rates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-xl p-4 border border-cyan-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-cyan-300 text-sm">
                          Neural AI Assistant
                        </span>
                        <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-xs font-medium">
                          AI
                        </span>
                        <span className="text-xs dark:text-gray-400 text-gray-800">
                          1 hour ago
                        </span>
                      </div>
                      <p className="text-sm dark:text-gray-300 text-gray-700">
                        Based on current market trends and your audience data, I
                        recommend breaking this into 4 key subtasks: Audience
                        Analysis, Content Pillars, Distribution Strategy, and
                        Performance Metrics. This approach will increase success
                        probability by 73%.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <textarea
                  placeholder="Add a neural comment..."
                  className="w-full px-4 py-3 dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 rounded-xl dark:text-white text-black placeholder-gray-400 resize-none focus:outline-none input-glow"
                  rows={3}
                ></textarea>
                <button className="mt-3 relative overflow-hidden bg-gradient-to-r from-neon-scarlet to-neon-fuchsia hover:from-neon-fuchsia hover:to-neon-scarlet text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 group">
                  <span>Post Comment</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDrawer;
