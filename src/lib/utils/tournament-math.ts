import { Couple, Match, MatchInsert } from "@/types/database";

// Given the number N, return the power of 2 inmediatly greater or equal (given 68, return 128)
export const nearestPowerOfTwo = (n: number) => {
    const exp = Math.log2(n) 
    const expCeil = Math.ceil(exp)
    return 2**expCeil;
}


// Shuffles the array. 
export const shuffleAlgorithm = <T>(array: T[]): T[] => {

    for (let currentIndex = array.length-1; currentIndex>0; currentIndex--) {

        // Generate random index to swap by the current one
        const randomIndex = Math.floor(Math.random() * (currentIndex + 1))
        
        // Make the swap (shuffle)
        const currentIndexValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex]  = currentIndexValue
    }

    return array

}

export const buildMatchesTree = (parentId: string | null, currentLevel: number, rowIndex: number, tournamentRounds: number, matchesArray: Partial<Match>[], tournament_id: string) => {
    
    // Base case: If the maximun rounds are exceded we stop
    if (currentLevel > tournamentRounds) return;

    const matchId = crypto.randomUUID();
    
    const match: Partial<Match> = {
        id: matchId,
        next_match_id: parentId,
        round: currentLevel,
        row_index: rowIndex,
        status: 'pending',
        tournament_id: tournament_id,
        is_bye: false
    };

    matchesArray.push(match);

    // Each match has two subsequent matches
    buildMatchesTree(matchId, currentLevel + 1, rowIndex * 2 - 1, tournamentRounds, matchesArray, tournament_id);
    buildMatchesTree(matchId, currentLevel + 1, rowIndex * 2,     tournamentRounds, matchesArray, tournament_id);
}


export const coupleAsignation = (matchesToInsert: MatchInsert[], tournamentRounds: number, couples: Couple[], currentRoundSlots: number): MatchInsert[] => {

    // We calculate how many matches should have 2 couples (Real Matches)

    /**
     * BRACKET AND PRELIMINARY ROUNDS LOGIC
     * ---------------------------------------
     * N = Number of registered couples (e.g.: 70)
     * T = Total bracket size (Next power of 2, e.g.: 128)
     * B = Byes (Couples that skip the first round)
     * * FORMULAS:
     * 1. Byes (Skips): 
     * $B = T - N$
     * * 2. Couples that DO play in the farthest round (Preliminary Round):
     * $P = N - B$
     * * 3. Matches to generate in that round:
     * $M = P / 2$
     * * EXAMPLE (70 couples):
     * T = 128 | B = 58 | P = 12 | M = 6 real matches.
     */

    const matchesWithTwoCouples = couples.length - (currentRoundSlots / 2);
    const lastRoundMatches: MatchInsert[] = matchesToInsert.filter(m => m.round === tournamentRounds);

    lastRoundMatches.forEach((match, index) => {
        if (index < matchesWithTwoCouples) {

            // Real match: pair two couples
            match.couple1_id = couples.shift()?.id || null;
            match.couple2_id = couples.shift()?.id || null;

            // Set the table where the match is going to play
            match.table_number = (index + 1).toString()
            match.is_bye = false

        } else {
            
            // Bye Handling
            const byeCouple = couples.shift()

            if (byeCouple) {
                match.is_bye = true
                match.status = 'completed'
                match.couple1_id = byeCouple.id
                match.couple2_id = null // I prefer to put couple_id as null to see better in logs that is a bye match.
                match.winner_id = byeCouple.id

                const parentMatch = matchesToInsert.find(m => m.id === match.next_match_id);

                if (parentMatch) {
                    if (!parentMatch.couple1_id) {
                        parentMatch.couple1_id = byeCouple.id;
                    } else {
                        parentMatch.couple2_id = byeCouple.id;
                    }
                }
            }
        }

    });

    return matchesToInsert;
}