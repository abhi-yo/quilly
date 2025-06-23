"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Users, Vote, Plus, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { web3Service } from '@/lib/web3';
import { useToast } from '@/hooks/use-toast';

interface Proposal {
  id: number;
  proposer: string;
  title: string;
  description: string;
  category: string;
  forVotes: string;
  againstVotes: string;
  startTime: number;
  endTime: number;
  executed: boolean;
}

export default function DAOGovernance() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: ''
  });
  const { toast } = useToast();

  const categories = [
    { value: 'FEATURE_REQUEST', label: 'Feature Request' },
    { value: 'POLICY_CHANGE', label: 'Policy Change' },
    { value: 'TOKEN_ECONOMICS', label: 'Token Economics' },
    { value: 'PLATFORM_UPGRADE', label: 'Platform Upgrade' },
    { value: 'COMMUNITY_INITIATIVE', label: 'Community Initiative' }
  ];

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/blockchain/dao');
      const data = await response.json();
      setProposals(data.proposals || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const createProposal = async () => {
    if (!newProposal.title || !newProposal.description || !newProposal.category) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    if (!web3Service.isConnected()) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const txHash = await web3Service.createProposal(
        newProposal.title,
        newProposal.description,
        newProposal.category
      );

      await fetch('/api/blockchain/dao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-proposal',
          ...newProposal,
          txHash
        })
      });

      toast({
        title: 'Proposal Created!',
        description: 'Your proposal has been submitted to the DAO',
      });

      setNewProposal({ title: '', description: '', category: '' });
      fetchProposals();

    } catch (error: any) {
      toast({
        title: 'Creation Failed',
        description: error.message || 'Failed to create proposal',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const voteOnProposal = async (proposalId: number, support: boolean) => {
    if (!web3Service.isConnected()) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }

    try {
      const txHash = await web3Service.voteOnProposal(proposalId, support);

      await fetch('/api/blockchain/dao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'vote',
          proposalId,
          support,
          txHash
        })
      });

      toast({
        title: 'Vote Cast!',
        description: `You voted ${support ? 'for' : 'against'} the proposal`,
      });

      fetchProposals();

    } catch (error: any) {
      toast({
        title: 'Vote Failed',
        description: error.message || 'Failed to cast vote',
        variant: 'destructive'
      });
    }
  };

  const getTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return 'Voting ended';
    
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  const getVotePercentage = (forVotes: string, againstVotes: string) => {
    const total = parseFloat(forVotes) + parseFloat(againstVotes);
    if (total === 0) return 50;
    return (parseFloat(forVotes) / total) * 100;
  };

  const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
    const isActive = Date.now() < proposal.endTime && !proposal.executed;
    const votePercentage = getVotePercentage(proposal.forVotes, proposal.againstVotes);
    
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-lg mb-2">{proposal.title}</CardTitle>
              <div className="flex gap-2 mb-2">
                <Badge variant="outline" className="border-gray-600 text-gray-400">
                  {categories.find(c => c.value === proposal.category)?.label || proposal.category}
                </Badge>
                <Badge 
                  variant={isActive ? "default" : "secondary"}
                  className={isActive ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-400"}
                >
                  {isActive ? 'Active' : 'Ended'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-sm">{proposal.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">For: {parseFloat(proposal.forVotes).toFixed(0)} QUILL</span>
              <span className="text-gray-400">Against: {parseFloat(proposal.againstVotes).toFixed(0)} QUILL</span>
            </div>
            <Progress value={votePercentage} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              {getTimeRemaining(proposal.endTime)}
            </div>
            
            {isActive && (
              <div className="flex gap-2">
                <Button
                  onClick={() => voteOnProposal(proposal.id, false)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/20 text-red-300 hover:bg-red-500/10"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Against
                </Button>
                <Button
                  onClick={() => voteOnProposal(proposal.id, true)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  For
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-500" />
          DAO Governance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="proposals" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
            <TabsTrigger value="proposals" className="data-[state=active]:bg-gray-700">
              Proposals
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-gray-700">
              Create Proposal
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposals" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg font-medium">Active Proposals</h3>
              <Badge variant="outline" className="border-gray-600 text-gray-400">
                {proposals.length} proposals
              </Badge>
            </div>
            
            {proposals.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <Vote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No proposals yet. Be the first to create one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Proposal title..."
                  value={newProposal.title}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={newProposal.category}
                  onValueChange={(value) => setNewProposal(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe your proposal in detail..."
                  value={newProposal.description}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>
              
              <Button
                onClick={createProposal}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Plus className="w-4 h-4 mr-2 animate-pulse" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Proposal
                  </>
                )}
              </Button>
              
              <div className="text-xs text-gray-500">
                Minimum 1000 QUILL tokens required to create a proposal
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 