import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Manuscript } from "@shared/schema";
import { Loader2, FileText, Clock, CheckCircle, AlertCircle, RefreshCw, Eye, FileDown, FileBadge, BookCopy, CalendarClock, Copy } from "lucide-react";

interface ManuscriptWithStatus {
  id: number;
  authorId: number | null;
  title: string;
  content: string | null;
  description: string | null;
  genre: string | null;
  wordCount: number | null;
  status: string;
  coverDesign: string | null;
  coverImage: string | null;
  feedback: string | null;
  editorNotes: string | null;
  targetAudience: string | null;
  progressStage: number | null;
  estimatedCompletionDate: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  // UI-specific properties
  coverImageUrl?: string;
}

export const ManuscriptList = () => {
  const { toast } = useToast();
  const [activeManuscript, setActiveManuscript] = useState<ManuscriptWithStatus | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  
  const { data: manuscripts = [], isLoading } = useQuery<ManuscriptWithStatus[]>({
    queryKey: ["/api/manuscripts"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const requestRevisionMutation = useMutation({
    mutationFn: async (manuscriptId: number) => {
      const res = await apiRequest("POST", `/api/manuscripts/${manuscriptId}/revision-request`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/manuscripts"] });
      toast({
        title: "Revision Requested",
        description: "Your revision request has been sent to the editor.",
      });
      setShowFeedbackDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const approveManuscriptMutation = useMutation({
    mutationFn: async (manuscriptId: number) => {
      const res = await apiRequest("POST", `/api/manuscripts/${manuscriptId}/approve`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/manuscripts"] });
      toast({
        title: "Manuscript Approved",
        description: "Your manuscript has been approved for publication.",
      });
      setShowFeedbackDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" />
          <p>Loading your manuscripts...</p>
        </div>
      </div>
    );
  }

  if (manuscripts.length === 0) {
    return (
      <Card className="text-center py-10">
        <CardHeader>
          <CardTitle>No Manuscripts Found</CardTitle>
          <CardDescription>
            You haven't uploaded any manuscripts yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Upload Your First Manuscript</Button>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "submitted":
        return <Badge variant="secondary">Submitted</Badge>;
      case "in_review":
        return <Badge className="bg-blue-500">In Review</Badge>;
      case "revision_requested":
        return <Badge className="bg-yellow-500">Revision Requested</Badge>;
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "published":
        return <Badge className="bg-purple-500">Published</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Group manuscripts by status
  const drafts = manuscripts.filter(m => m.status === "draft");
  const inProgress = manuscripts.filter(m => ["submitted", "in_review", "revision_requested"].includes(m.status));
  const completed = manuscripts.filter(m => ["accepted", "published", "rejected"].includes(m.status));

  return (
    <div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All ({manuscripts.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({inProgress.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {manuscripts.map((manuscript) => (
            <ManuscriptCard 
              key={manuscript.id} 
              manuscript={manuscript}
              onView={() => {
                setActiveManuscript(manuscript);
                setShowDetailDialog(true);
              }}
              onFeedback={() => {
                setActiveManuscript(manuscript);
                setShowFeedbackDialog(true);
              }}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="drafts" className="space-y-6">
          {drafts.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No draft manuscripts found.</p>
          ) : (
            drafts.map((manuscript) => (
              <ManuscriptCard 
                key={manuscript.id} 
                manuscript={manuscript} 
                onView={() => {
                  setActiveManuscript(manuscript);
                  setShowDetailDialog(true);
                }}
                onFeedback={() => {
                  setActiveManuscript(manuscript);
                  setShowFeedbackDialog(true);
                }}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-6">
          {inProgress.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No manuscripts currently in progress.</p>
          ) : (
            inProgress.map((manuscript) => (
              <ManuscriptCard 
                key={manuscript.id} 
                manuscript={manuscript} 
                onView={() => {
                  setActiveManuscript(manuscript);
                  setShowDetailDialog(true);
                }}
                onFeedback={() => {
                  setActiveManuscript(manuscript);
                  setShowFeedbackDialog(true);
                }}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6">
          {completed.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No completed manuscripts found.</p>
          ) : (
            completed.map((manuscript) => (
              <ManuscriptCard 
                key={manuscript.id} 
                manuscript={manuscript} 
                onView={() => {
                  setActiveManuscript(manuscript);
                  setShowDetailDialog(true);
                }}
                onFeedback={() => {
                  setActiveManuscript(manuscript);
                  setShowFeedbackDialog(true);
                }}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
      
      {/* Manuscript Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl">
          {activeManuscript && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{activeManuscript.title}</DialogTitle>
                <DialogDescription className="flex items-center pt-2">
                  <div>
                    {getStatusBadge(activeManuscript.status)}
                  </div>
                  <Separator className="mx-3 h-4" orientation="vertical" />
                  <span className="text-sm">
                    Submitted on {activeManuscript.createdAt ? new Date(activeManuscript.createdAt).toLocaleDateString() : 'unknown date'}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Description</h3>
                    <p className="text-gray-600">
                      {activeManuscript.description || "No description provided."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Genre</h3>
                      <p className="text-gray-600">{activeManuscript.genre || "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Word Count</h3>
                      <p className="text-gray-600">{activeManuscript.wordCount || "Not available"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Target Audience</h3>
                      <p className="text-gray-600">{activeManuscript.targetAudience || "Not specified"}</p>
                    </div>
                  </div>
                  
                  {activeManuscript.feedback && (
                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-1">Editorial Feedback</h3>
                      <div className="bg-gray-50 p-3 rounded-md text-gray-700 text-sm">
                        {activeManuscript.feedback}
                      </div>
                    </div>
                  )}
                  
                  {activeManuscript.editorNotes && (
                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-1">Editor's Notes</h3>
                      <div className="bg-gray-50 p-3 rounded-md text-gray-700 text-sm">
                        {activeManuscript.editorNotes}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {activeManuscript.coverImageUrl && (
                    <div>
                      <img 
                        src={activeManuscript.coverImageUrl} 
                        alt="Cover design" 
                        className="w-full h-auto rounded-md shadow-md"
                      />
                      <p className="text-xs text-center text-gray-500 mt-1">Proposed cover design</p>
                    </div>
                  )}
                  
                  {activeManuscript.progressStage !== undefined && (
                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">Publishing Progress</h3>
                      <Progress value={(activeManuscript.progressStage || 0) * 25} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Submitted</span>
                        <span>Editing</span>
                        <span>Design</span>
                        <span>Published</span>
                      </div>
                    </div>
                  )}
                  
                  {activeManuscript.estimatedCompletionDate && (
                    <div className="pt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarClock className="h-4 w-4 mr-1 text-gray-400" />
                        <span>Estimated completion: {activeManuscript.estimatedCompletionDate ? new Date(activeManuscript.estimatedCompletionDate).toLocaleDateString() : 'To be determined'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-1" /> Download Manuscript
                  </Button>
                  {activeManuscript.status === "revision_requested" && (
                    <Button size="sm">
                      <FileText className="h-4 w-4 mr-1" /> Upload Revision
                    </Button>
                  )}
                </div>
                <Button onClick={() => setShowDetailDialog(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Manuscript Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          {activeManuscript && (
            <>
              <DialogHeader>
                <DialogTitle>Manuscript Feedback</DialogTitle>
                <DialogDescription>
                  Review feedback for "{activeManuscript.title}"
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
                  <div className="text-blue-500 mt-1">
                    <FileBadge className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Current Status</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      {activeManuscript.status === "draft" && "Your manuscript is still in draft mode and hasn't been submitted for review."}
                      {activeManuscript.status === "submitted" && "Your manuscript has been submitted and is waiting for editorial review."}
                      {activeManuscript.status === "in_review" && "Your manuscript is currently being reviewed by our editorial team."}
                      {activeManuscript.status === "revision_requested" && "Our editors have requested revisions to your manuscript."}
                      {activeManuscript.status === "accepted" && "Congratulations! Your manuscript has been accepted for publication."}
                      {activeManuscript.status === "published" && "Your book is now published and available in our bookstore."}
                      {activeManuscript.status === "rejected" && "Unfortunately, your manuscript was not accepted for publication."}
                    </p>
                  </div>
                </div>
                
                {activeManuscript.feedback && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Editorial Feedback</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{activeManuscript.feedback}</p>
                  </div>
                )}
                
                {activeManuscript.status === "revision_requested" && (
                  <div className="flex flex-col space-y-3 mt-4">
                    <Button variant="outline" onClick={() => requestRevisionMutation.mutate(activeManuscript.id)}>
                      <RefreshCw className="h-4 w-4 mr-2" /> Submit Revised Manuscript
                    </Button>
                    <Button variant="secondary" onClick={() => approveManuscriptMutation.mutate(activeManuscript.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" /> Approve Current Version
                    </Button>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button onClick={() => setShowFeedbackDialog(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ManuscriptCardProps {
  manuscript: ManuscriptWithStatus;
  onView: () => void;
  onFeedback: () => void;
}

const ManuscriptCard = ({ manuscript, onView, onFeedback }: ManuscriptCardProps) => {
  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-5 w-5 text-gray-400" />;
      case "submitted":
        return <Clock className="h-5 w-5 text-blue-400" />;
      case "in_review":
        return <Eye className="h-5 w-5 text-purple-400" />;
      case "revision_requested":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case "accepted":
        return <BookCopy className="h-5 w-5 text-green-400" />;
      case "published":
        return <Copy className="h-5 w-5 text-purple-600" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg font-semibold">{manuscript.title}</CardTitle>
          <div>
            {getStatusIcon(manuscript.status)}
          </div>
        </div>
        <CardDescription className="flex flex-wrap gap-2 items-center">
          {manuscript.status === "revision_requested" && (
            <Badge variant="destructive" className="mr-2">Action Required</Badge>
          )}
          <span>{manuscript.createdAt ? new Date(manuscript.createdAt).toLocaleDateString() : 'No date'}</span>
          {manuscript.genre && (
            <>
              <span className="text-gray-400">•</span>
              <span>{manuscript.genre}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-2">
          {manuscript.description || "No description provided."}
        </p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-sm">
          {manuscript.wordCount && (
            <div className="flex items-center text-gray-500">
              <span className="font-medium">Word Count:</span>
              <span className="ml-1">{manuscript.wordCount}</span>
            </div>
          )}
          
          {manuscript.targetAudience && (
            <div className="flex items-center text-gray-500">
              <span className="font-medium">Audience:</span>
              <span className="ml-1">{manuscript.targetAudience}</span>
            </div>
          )}
        </div>
        
        {manuscript.progressStage !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress:</span>
              <span>{(manuscript.progressStage || 0) * 25}%</span>
            </div>
            <Progress value={(manuscript.progressStage || 0) * 25} className="h-1" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onFeedback}>
          <FileBadge className="h-4 w-4 mr-1" />
          Feedback
        </Button>
        <Button variant="outline" size="sm" onClick={onView}>
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};